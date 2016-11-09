angular.module('app').component("idSearch",{
	bindings:{},
	templateUrl:'app/components/idSearch/idSearch.html?t='+Date.now(),
	controller:["$scope","cache","tagName","aliasList","tagRelation",function($scope,cache,tagName,aliasList,tagRelation){
		$scope.cache=cache;
		$scope.cache.id_search || ($scope.cache.id_search={});
		$scope.cache.id_search.search || ($scope.cache.id_search.search=[]);
		var get_id_relation_tag=function(source_id,callback){
			return new Promise(function(resolve,reject){
				promiseRecursive(function* (){
					var where_list=[
						{field:'wid',type:0,value:$scope.cache.webList.select},
						{field:'source_id',type:0,value:source_id},
					];
					var res=yield aliasList.get(where_list)//把source_id轉換成id
					if(res.status){
						var item=res.list.pop();
						
						var where_list=[
							{field:'level_id',type:0,value:$scope.cache.levelList[$scope.cache.levelList.length-1].id},
							{field:'child_id',type:0,value:item.id},
						];
						tagRelation.get(where_list).then(resolve);
						
					}
					else{
						resolve();
						// yield Promise.reject("alias_list不存在");
					}
				}());
			})
		}
		var id_search_tag=function(){
			clearTimeout($scope.id_search_tag_timer)
			$scope.id_search_tag_timer=setTimeout(function(){
				var ids=$scope.cache.id_search.search;
				$scope.cache.id_search.result || ($scope.cache.id_search.result={})
				for(var i in ids){
					var id=ids[i];
					
					get_id_relation_tag(ids[i])
					.then(function(id,res){
						if(res.status){
							$scope.cache.id_search.result[id]=res.list;
							if(Object.keys($scope.cache.id_search.result).length==ids.length){
								$scope.$apply();
							}
							// console.log(res.list)
							return res.list.map(function(val){
								return val.id;
							})
						}else{
							$scope.cache.id_search.result[id]=[];
							$scope.$apply();
						}
						
					}.bind(this,id))
					.then(tagName.idToName)
					.catch(function(message){
						// console.log(message)
					})
				}
			},500);
		}
		$scope.$watch("cache.id_search.search",function(value){
			if(!value)return;
			id_search_tag();
		},1)
		$scope.add_id_search=function(id){
			if($scope.cache.id_search.search.indexOf(id)==-1){
				$scope.cache.id_search.search.push(id)
			}
		}
		$scope.del_id_search=function(index){
			var source_id=$scope.cache.id_search.search.splice(index,1).pop();
			delete $scope.cache.id_search.result[source_id];
		}


		$scope.add_relation=function(name,source_id){
			promiseRecursive(function* (name,source_id){
				if(!$scope.cache.levelList.length){
					alert("你還沒建立階層!!");
					return
				}
				var level_id=$scope.cache.levelList[$scope.cache.levelList.length-1].id;
				var wid=$scope.cache.webList.select;
				var add_relation_object={
					level_id:level_id,
				};
				
				var list=yield tagName.nameToId(name);
				
				add_relation_object.id=list.pop().id;
				
				var where_list=[
					{field:'wid',type:0,value:wid},
					{field:'source_id',type:0,value:source_id},
				];				
				var res=yield aliasList.get(where_list); //把source_id轉換成id
				if(res.status){
					var item=res.list.pop();
				}else{
					var item=yield aliasList.add({
						wid:wid,
						source_id:source_id,
					});
				}
				add_relation_object.child_id=item.id;
				add_relation_object.sort_id=$scope.cache.id_search.result[source_id].length
				
				cache.treeData.map(function(tree){
					var find_data=tree[tree.length-1].list.find(function(val){
						return val.id==add_relation_object.id && val.level_id==add_relation_object.level_id;
					});
					if(find_data)
						find_data.count++;
				})
				
				var result=yield tagRelation.add(add_relation_object);
				
				$scope.cache.id_search.result[source_id].push(result);
				
				tagName.idToName([result]);
				
				tag_search_id();
				$scope.$apply();
			}(name,source_id));
		}


		$scope.del_relation=function(index,source_id){
			if(!confirm("確認刪除關聯?"))return;
			var del=angular.copy($scope.cache.id_search.result[source_id][index]);
			del.auto_delete=1;
			
			
			tagRelation.del(del)
			.then(function(){
				cache.treeData.map(function(tree){
					var index=tree[tree.length-1].list.findIndex(function(val){
						return val.id==del.id && val.level_id==del.level_id;
					});
					if(index!=-1){
						tree[tree.length-1].list[index].count--;
					}
				})
				$scope.cache.id_search.result[source_id].splice(index,1);
				$scope.$apply();
			})
		}


		$scope.$watch("cache.id_search.result",function(result){
			if(!result)return;
			for(var i in result)
			$scope.$watch("cache.id_search.result["+i+"]",function(curr,prev){
				if(!curr)return;
				if(!prev)return;
				if(curr.length!=prev.length)return;
				clearTimeout($scope.result_timer)
				$scope.result_timer=setTimeout(function(){
					for(var i in curr){
						if(curr[i])
						if(prev[i])
						if(curr[i].id!=prev[i].id){
							var id=curr[i].id;
							var level_id=curr[i].level_id;
							var child_id=curr[i].child_id
							var sort_id=i;
							tagRelation.ch({
								update:{
									sort_id:sort_id
								},
								where:{
									id:id,
									level_id:level_id,
									child_id:child_id,
								},
							})
							.then(function(i,res){
								if(res.status){
									curr[i].sort_id=i;
									$scope.$apply();
								}
							}.bind(this,i));
						}
					}
				},500)				
			},1)
		});
		
	}],
})