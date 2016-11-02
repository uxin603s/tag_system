angular.module('app').component("searchRelation",{
	bindings:{},
	templateUrl:'app/components/searchRelation/searchRelation.html?t='+Date.now(),
	controller:["$scope","cache","tagName","aliasList","tagRelation",function($scope,cache,tagName,aliasList,tagRelation){
		$scope.cache=cache;
		$scope.cache.tag_search || ($scope.cache.tag_search={});
		$scope.cache.id_search || ($scope.cache.id_search={});
		
		var search_last_level=function(where_list){
			return new Promise(function(resolve,reject){
				var post_data={
					func_name:'TagRelation::getList',
					arg:{
						where_list:where_list,
					},
				}
				$.post("ajax.php",post_data,function(res){
					if(res.status){
						resolve(res.list);
					}else{
						reject("沒有任何關聯")
					}
					$scope.$apply();
				},"json");
			});
		}
		var tag_search_id=function(){		
			var value=$scope.cache.tag_search.search;
			tagName.nameToId(value,1)
			.then(function(list){
			
				// console.log($scope.cache.tag_search.search.length,ids.length)
				if($scope.cache.tag_search.search.length==list.length){
					var where_list=[
						{field:'level_id',type:0,value:$scope.cache.levelList[$scope.cache.levelList.length-1].data.id},
					];
					for(var i in list){
						where_list.push({field:'id',type:0,value:list[i].id});
					}
					return search_last_level(where_list);
				}else{
					return Promise.reject("標籤有些不存在");
				}
			})
			.then(function(list){
				
				var count=$scope.cache.tag_search.search.length;
				var child_id_result={};
				
				for(var i in list){
					var data=list[i];
					var child_id=data.child_id;
					var id=data.id;
					child_id_result[child_id] || (child_id_result[child_id]=[])
					child_id_result[child_id].push(id)
				}
				var child_ids=[];
				for(var i in child_id_result){
					if(child_id_result[i].length==count){//擁有搜尋標籤的id
						child_ids.push(i)
					}
				}
				if(child_ids.length){
					var where_list=[
						{field:'wid',type:0,value:$scope.cache.webList.select},
					];
					for(var i in child_ids){
						where_list.push({field:'id',type:0,value:child_ids[i]})
					}
					return aliasList.get(where_list);//把id轉換成source_id
				}else{
					return Promise.reject("標籤沒有命中id");
				}
			})
			.then(function(res){
				if(res.status){
					$scope.cache.tag_search.result=res.list.map(function(value){
						return value.source_id;
					})
					$scope.$apply()
				}
			})
			.catch(function(message){
				// console.log(message)
				$scope.cache.tag_search.result=[];
				$scope.$apply()
			})
		}
		$scope.$watch("cache.tag_search.search",function(value){
			if(!value)return;
			tag_search_id();
		});
		
		$scope.add_tag_search=function(name){
			$scope.cache.tag_search.search || ($scope.cache.tag_search.search=[]);
			if($scope.cache.tag_search.search.indexOf(name)==-1){
				$scope.cache.tag_search.search.push(name);
			}
			tag_search_id();
		}
		$scope.del_tag_search=function(index){
			$scope.cache.tag_search.search.splice(index,1);
			tag_search_id();
		}
		
		$scope.add_id_search=function(id){
			
			$scope.cache.id_search.search || ($scope.cache.id_search.search=[]);
			if($scope.cache.id_search.search.indexOf(id)==-1){
				$scope.cache.id_search.search.push(id)
			}
			id_search_tag();
		}
		$scope.del_id_search=function(index){
			var source_id=$scope.cache.id_search.search.splice(index,1).pop();
			delete $scope.cache.id_search.result[source_id];
			id_search_tag();
		}
		var get_id_relation_tag=function(source_id,callback){
			return new Promise(function(resolve,reject){
				var where_list=[
					{field:'wid',type:0,value:$scope.cache.webList.select},
					{field:'source_id',type:0,value:source_id},
				];
				aliasList.get(where_list)//把source_id轉換成id
				.then(function(res){
					if(res.status){
						return res.list.pop();
					}
					else{
						return Promise.reject("alias_list不存在");
					}
				})
				.then(function(item){
					if(item){
						var where_list=[
							{field:'level_id',type:0,value:$scope.cache.levelList[$scope.cache.levelList.length-1].data.id},
							{field:'child_id',type:0,value:item.id},
						];
						return search_last_level(where_list);
					}
				})
				.then(resolve)
				.catch(function(message){
					// console.log(message)
					resolve([])
				})
			})
		}
		var get_tag_name=function(list){
			
			$scope.cache.tag_name || ($scope.cache.tag_name={});
			var where_list=[];
			for(var i in list){
				var id=list[i].id;
				if(!$scope.cache.tag_name[id]){
					where_list.push({field:'id',type:0,value:id})
				}
			}
			if(where_list.length){
				tagName.getList(where_list).then(function(list){
					for(var i in list){
						var data=list[i];
						$scope.cache.tag_name[data.id]=data.name;
					}
					$scope.$apply();
				});
			}
		}
		var id_search_tag=function(){
			var ids=$scope.cache.id_search.search;
			for(var i in ids){
				get_id_relation_tag(ids[i])
				.then(function(id,list){
					// console.log(list)
					$scope.cache.id_search.result[id]=list;
					if(Object.keys($scope.cache.id_search.result).length==ids.length){
						$scope.$apply();
					}
					return list;
				}.bind(this,ids[i]))
				.then(get_tag_name)
			}
		}
		$scope.$watch("cache.id_search",function(value){
			if(!value)return;
			id_search_tag();
		})
		$scope.add_relation=function(name,source_id){
			var add_relation_object={
				level_id:$scope.cache.levelList[$scope.cache.levelList.length-1].data.id
			};
			tagName.nameToId(name)
			.then(function(list){
				add_relation_object.id=list.pop().id;
				var where_list=[
					{field:'wid',type:0,value:$scope.cache.webList.select},
					{field:'source_id',type:0,value:source_id},
				];				
				return aliasList.get(where_list);//把source_id轉換成id
			})
			.then(function(res){
				if(res.status){
					return res.list.pop();
				}else{
					return aliasList.add({
						wid:$scope.cache.webList.select,
						source_id:source_id,
					});
				}
			})
			.then(function(item){
				add_relation_object.child_id=item.id;
				return tagRelation.add(add_relation_object);
			})
			.then(function(res){
				get_tag_name([res.insert])
				if(res.status){
					$scope.cache.id_search.result[source_id].push(res.insert);
					
					var list=$scope.cache.levelList[$scope.cache.levelList.length-1].list;
					var find_data=list.find(function(value){
						return value.id==res.insert.id
					})
					if(find_data){
						find_data.count++;
					}
				}
				$scope.$apply();
				
			})
		}
		$scope.del_relation=function(index,source_id){
			if(!confirm("確認刪除關聯?"))return;
			var del=angular.copy($scope.cache.id_search.result[source_id][index]);
			del.auto_delete=1;
			tagRelation.del(del)
			.then(function(res){
				if(res.status){
					var del=$scope.cache.id_search.result[source_id].splice(index,1).pop();
					var list=$scope.cache.levelList[$scope.cache.levelList.length-1].list;
					var find_data=list.find(function(value){
						return value.id==del.id
					})
					if(find_data){
						find_data.count--;
					}
					$scope.$apply();
				}
			})
		}
	}],
})

