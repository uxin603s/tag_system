angular.module('app').component("idSearch",{
	bindings:{},
	templateUrl:'app/components/idSearch/idSearch.html?t='+Date.now(),
	controller:["$scope","cache","tagName","aliasList","tagRelation",function($scope,cache,tagName,aliasList,tagRelation){
		$scope.cache=cache;
		$scope.cache.id_search || ($scope.cache.id_search={});
		$scope.cache.id_search.search || ($scope.cache.id_search.search=[]);
		$scope.cache.id_search.select || ($scope.cache.id_search.select=[]);
		var get_id_relation_tag=function(source_id,callback){
			return new Promise(function(resolve,reject){
				promiseRecursive(function* (){
					var where_list=[
						{field:'wid',type:0,value:$scope.cache.webList.list[$scope.cache.webList.select].id},
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
			},0);
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
		$scope.select_id_search=function(item){
			var index=cache.id_search.select.indexOf(item);
			if(index==-1){
				cache.id_search.select.push(item)
			}else{
				cache.id_search.select.splice(index,1)
			}
			
		}

		$scope.add_relation=function(name,source_id){
			return promiseRecursive(function* (name,source_id){
				
				var level_id=$scope.cache.levelList[$scope.cache.levelList.length-1].id;
				var wid=$scope.cache.webList.list[$scope.cache.webList.select].id;
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
				
				
				
				var result=yield tagRelation.add(add_relation_object);
				
				$scope.cache.id_search.result[source_id].push(add_relation_object);
				$scope.cache.id_search.result[source_id].map(function(val,key){
					val.sort_id=key
				})
				$scope.cache.id_search.result[source_id].sort(function(a,b){
					return a.sort_id-b.sort_id;
				})
				tagName.idToName([result]);
				
				
				$scope.$apply();
			}(name,source_id));
		}


		$scope.del_relation=function(index,source_id){
			// if(!confirm("確認刪除關聯?"))return;
			var del=angular.copy($scope.cache.id_search.result[source_id][index]);
			del.auto_delete=1;
			
			
			tagRelation.del(del)
			.then(function(){
				$scope.cache.id_search.result[source_id].splice(index,1);
				$scope.$apply();
				cache.treeData.map(function(tree){
					var index=tree[tree.length-1].list.findIndex(function(val){
						return val.id==del.id && val.level_id==del.level_id;
					});
					if(index!=-1){
						tree[tree.length-1].list[index].count--;
					}
				})
				$scope.$apply();
			})
		}


		$scope.$watch("cache.id_search.result",function(result){
			if(!result)return;
			for(var i in result)
			$scope.$watch("cache.id_search.result["+i+"]",function(curr,prev){
				if(!curr)return;
				if(!prev)return;
				// if(curr.length!=prev.length)return;
				clearTimeout($scope.result_timer)
				$scope.result_timer=setTimeout(function(){
					for(var i in curr){
						if(curr[i])
						if(prev[i])
						if(curr[i].sort_id!=prev[i].sort_id || curr[i].id!=prev[i].id){
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
				},0)				
			},1)
		});
		
		var prev={};
		var watch_select=function(){
			// if(JSON.stringify(curr)==JSON.stringify(prev))return;
			
			clearTimeout($scope.clickSearch_timer)
			$scope.clickSearch_timer=setTimeout(function(){
			
				var select_arr=cache.id_search.select;
				
				for(var i in select_arr){
					var select=select_arr[i];
				
					var curr=angular.copy(cache.clickSearch);
					var currClickSearch=curr.filter(function(val){
						return !val.type;
					});
					// console.log(prev)
					if(prev[i]){
						var prevClickSearch=prev[i].filter(function(val){
							return !val.type;
						});
					}
					prev[i]=curr;
					var add=[];
					
					for(var i in currClickSearch){
						add.push(currClickSearch[i].name);
					}
					
					var del=[];
					if(false)
					for(var i in prevClickSearch){
						if(add.indexOf(prevClickSearch[i].name)==-1)
							del.push(prevClickSearch[i].name);
					}
					
					// console.log(add)
					
					var result=cache.id_search.result;
					// console.log(result)
					
					if(!result[select]){
						result[select]=[];
					}
					var list=result[select];
					
					
					for(var i in del){
						var name=del[i];
						var index=list.findIndex(function(val){
							return $scope.cache.tagName[val.id]==name;
						})
						if(index!=-1)
							$scope.del_relation(index,select);
					}
					
					
					promiseRecursive(function* (add,list,select){
						for(var i in add){
							var name=add[i];
							var index=list.findIndex(function(val){
								return $scope.cache.tagName[val.id]==name;
							})
							if(index==-1)
								yield $scope.add_relation(name,select);
						}
					}(add,list,select))
				}
				$scope.$apply();
			},0)
		}
		
		$scope.$watch("cache.id_search.select",watch_select,1)
		$scope.$watch("cache.clickSearch",watch_select,1)
	}],
})