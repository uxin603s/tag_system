angular.module('app').component("searchRelation",{
	bindings:{},
	templateUrl:'app/components/searchRelation/searchRelation.html?t='+Date.now(),
	controller:["$scope","cache","tagName","aliasList","tagRelation",function($scope,cache,tagName,aliasList,tagRelation){
		$scope.cache=cache;
		$scope.cache.tag_search || ($scope.cache.tag_search={});
		$scope.cache.id_search || ($scope.cache.id_search={});
		// $scope.cache.tag_search.search || ($scope.cache.tag_search.search=[])
		var search_last_level=function(require_id,option_id){
			return new Promise(function(resolve,reject){
				var post_data={
					func_name:'TagRelation::getIntersection',
					arg:{
						require_id:require_id,
						option_id:option_id,
					},
				}
				$.post("ajax.php",post_data,function(res){
					if(res.status){
						resolve(res.list);
					}else{
						reject(require_id.join(",")+" search_last_level 沒有資料")
					}
					$scope.$apply();
				},"json");
			});
		}
		var tag_search_id=function(){
			clearTimeout($scope.tag_search_id_timer)
			$scope.tag_search_id_timer=setTimeout(function(){
				var value=$scope.cache.tag_search.search.map(function(val){
					return val.name;
				});
				// console.log(value)
				tagName.nameToId(value,1)
				.then(function(list){
					if($scope.cache.tag_search.search.length==list.length){
						var require_id=[];
						var option_id=[];
						for(var i in list){
							var data=list[i];
							var id=data.id;
							var name=data.name;
							var find=$scope.cache.tag_search.search.find(function(val){
								return val.name==name;
							});
							if(find.type){
								option_id.push(id);
							}else{
								require_id.push(id)
							}
						}
						
						return search_last_level(require_id,option_id);
					}else{
						return Promise.reject("標籤有些不存在");
					}
				})
				.then(function(list){
					
					if(list.length){
						var where_list=[
							{field:'wid',type:0,value:$scope.cache.webList.select},
						];
						for(var i in list){
							where_list.push({field:'id',type:0,value:list[i]})
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
			},500);
		}
		$scope.$watch("cache.tag_search.search",function(value){
			// console.log('tag_search_id')
			$scope.cache.tag_search.search || ($scope.cache.tag_search.search=[]);
			if(!value)return;
			tag_search_id();
		},1);
		
		$scope.add_tag_search=function(name){
			
			var index=$scope.cache.tag_search.search.findIndex(function(val){
				return val.name==name;
			})
			if(index==-1){
				$scope.cache.tag_search.search.push({name:name});
			}
		}
		$scope.del_tag_search=function(index){
			$scope.cache.tag_search.search.splice(index,1);
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
						return tagRelation.get(where_list);
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
				tagName.getList(where_list)
				.then(function(list){
					for(var i in list){
						var data=list[i];
						$scope.cache.tag_name[data.id]=data.name;
					}
					$scope.$apply();
				});
			}
		}
		var id_search_tag=function(){
			clearTimeout($scope.id_search_tag_timer)
			$scope.id_search_tag_timer=setTimeout(function(){
				var ids=$scope.cache.id_search.search;
				$scope.cache.id_search.result || ($scope.cache.id_search.result={})
				for(var i in ids){
					get_id_relation_tag(ids[i])
					.then(function(id,res){
						if(res.status){
							$scope.cache.id_search.result[id]=res.list;
							if(Object.keys($scope.cache.id_search.result).length==ids.length){
								$scope.$apply();
							}
							return res.list;
						}else{
							// console.log(id)
							$scope.cache.id_search.result[id]=[];
							$scope.$apply();
							return Promise.reject("id_search_tag 沒有資料");
						}
					}.bind(this,ids[i]))
					.then(get_tag_name)
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
			if(!$scope.cache.webList.select){
				alert("請選擇網站");
				return;
			}
			$scope.cache.id_search.search || ($scope.cache.id_search.search=[]);
			if($scope.cache.id_search.search.indexOf(id)==-1){
				$scope.cache.id_search.search.push(id)
			}
		}
		$scope.del_id_search=function(index){
			var source_id=$scope.cache.id_search.search.splice(index,1).pop();
			delete $scope.cache.id_search.result[source_id];
		}
		
		
		$scope.add_relation=function(name,source_id){
			if(!$scope.cache.webList.select){
				alert("請選擇網站");
				return;
			}
			
			if(!$scope.cache.tagType.select){
				alert("請選擇類別");
				return;
			}
			promiseRecursive(function* (name,source_id){
				if(!$scope.cache.levelList.length){
					alert("你還沒建立階層!!");
					return
				}
				var level_id=$scope.cache.levelList[$scope.cache.levelList.length-1].data.id;
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
				var res=yield aliasList.get(where_list);//把source_id轉換成id
				if(res.status){
					var item=res.list.pop();
				}else{
					var item=yield aliasList.add({
						wid:wid,
						source_id:source_id,
					});
				}
				add_relation_object.child_id=item.id;
				
				var result=yield tagRelation.add(add_relation_object);
				get_tag_name([result]);
				$scope.cache.id_search.result[source_id].push(result);
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
				$scope.cache.id_search.result[source_id].splice(index,1);
				tag_search_id();
				$scope.$apply();
			})
		}
		var watch_last_level=function(levelList){
			var tag_name=$scope.cache.tag_name;
			var levelList=$scope.cache.levelList;
			if(!tag_name)return;
			if(!levelList.length)return;
			
			$scope.$watch("cache.levelList["+(levelList.length-1)+"].list",function(curr,prev){				
				if(!curr)return;
				if(!prev)return;
				
				if(curr.length==prev.length)return;
				for(var i in curr){
					var tag=tag_name[curr[i].id];
					// console.log(tag)
					var index=$scope.cache.tag_search.search.findIndex(function(val){
						return val.name==tag;
					});
					if(index==-1){
						$scope.cache.tag_search.search.push({name:tag,type:1})
					}
				}
				// console.log(curr,prev,$scope.rm_cache_select)
				for(var i in prev){
					var tag=tag_name[prev[i].id];
					// console.log(tag)
					var index=$scope.cache.tag_search.search.findIndex(function(val){
						return val.name==tag;
					});
					if(index!=-1){
						$scope.cache.tag_search.search.splice(index,1);
					}
				}
			})
			
			$scope.$watch("cache.levelList["+(levelList.length-1)+"].select",function(curr,prev){

				var prev_tag=tag_name[prev];
				var curr_tag=tag_name[curr];
				
				
				var list=$scope.cache.levelList[$scope.cache.levelList.length-1].list.map(function(val){
					return tag_name[val.id];
				});
				
				if(prev_tag){
					var index=$scope.cache.tag_search.search.findIndex(function(val){
						return val.name==prev_tag;
					});
					if(index!=-1)
						$scope.cache.tag_search.search.splice(index,1)
				}
				
				while(list[0]){
					var index=$scope.cache.tag_search.search.findIndex(function(val){
						return val.name==list[0];
					});
					
					if(curr_tag){
						if(index!=-1)
							$scope.cache.tag_search.search.splice(index,1)
					}
					else{
						if($scope.cache.levelList.length!=1)
						if(index==-1){
							$scope.cache.tag_search.search.push({name:list[0]})
						}
					}
					
					list.splice(0,1);
				}
				
				
				if(curr_tag){
					var index=$scope.cache.tag_search.search.findIndex(function(val){
						return val.name==curr_tag;
					});
					if(index==-1){
						$scope.cache.tag_search.search.push({name:curr_tag})
					}
				}
				
			},1);
		}
		$scope.$watch("cache.levelList",watch_last_level);
		$scope.$watch("cache.tag_name",watch_last_level);
		
	}],
})

