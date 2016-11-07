angular.module("app").component("tagRelationCount",{
	bindings:{
		levelIndex:"=",
	},
	templateUrl:'app/components/tagRelationCount/tagRelationCount.html?t='+Date.now(),
	controller:["$scope","cache","tagName","tagRelation","tagRelationCount",function($scope,cache,tagName,tagRelation,tagRelationCount){
		$scope.cache=cache;
		$scope.tag={};
		
		$scope.delete_level=function(id){
			if(!confirm("確認刪除?")){
				return;
			}
			var post_data={
				func_name:'TagRelationLevel::delete',
				arg:{
					id:id,
					tid:$scope.cache.tagType.select,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					var index=$scope.cache.levelList.findIndex(function(value){
						return value.data.id==id;
					});
					if(index!=-1){
						$scope.cache.levelList.splice(index,1);
					}
					$scope.$apply();
				}
			},"json")
		}
		
		
		
		var search_tag_name=function(){
			return new Promise(function(resolve,reject) {
				if($scope.tag.name){
					//搜尋模式
					tagName.nameToId("%"+$scope.tag.name+"%",1)
					.then(function(list){
						if(list.length){
							resolve(list.map(function(val){
								return val.id;
							}));
						}
					})
				}else{
					resolve();
				}
			});
		}
		var search_select_tag=function(ids){
			return new Promise(function(resolve,reject) {
				ids || (ids=[])
				if($scope.$ctrl.levelIndex==0){
					// console.log(1)
					resolve(ids);
				}
				else if(!isNaN(cache.levelList[$scope.$ctrl.levelIndex-1].select)){
					// console.log(2)
					var levelList_data=$scope.cache.levelList[$scope.$ctrl.levelIndex-1];
					var level_id=levelList_data.data.id;
					var id=levelList_data.select;
					var where_list=[
						{field:'level_id',type:0,value:level_id},
						{field:'id',type:0,value:id},
					];
					for(var i in ids){
						where_list.push({field:'child_id',type:0,value:ids[i]})
					}
					return tagRelation.get(where_list)
					.then(function(res){
						var child_ids=[];
						if(res.status){
							for(var i in res.list){
								child_ids.push(res.list[i].child_id);
							}
							resolve(child_ids);
						}else{
							reject("沒有關聯");
						}
						
					});
				}else{
					$scope.cache.levelList[$scope.$ctrl.levelIndex].list=[];
					reject("沒選東西");
				}
				$scope.$apply();
			});
		}
		
		$scope.get=function(){
			clearTimeout($scope.Timer);
			$scope.Timer=setTimeout(function(){
				search_tag_name()
				.then(function(ids){
					return search_select_tag(ids);
				})
				.then(function(ids){
					var levelList_data=$scope.cache.levelList[$scope.$ctrl.levelIndex];
					var level_id=levelList_data.data.id;
					var where_list=[
						{field:'level_id',type:0,value:level_id},
					];
					if(ids){
						for(var i in ids){
							where_list.push({field:'id',type:0,value:ids[i]})
						}
					}
					return tagRelationCount.get(where_list);
				})
				.then(function(res){
					$scope.cache.tag_name || ($scope.cache.tag_name={});
					if(res.status){
						var where_list=[];
						for(var i in res.list){
							var id=res.list[i].id;
							if(!$scope.cache.tag_name[id]){
								where_list.push({field:'id',type:0,value:id})
							}
						}
						$scope.cache.levelList[$scope.$ctrl.levelIndex].list=res.list;
						$scope.$apply();
						if(where_list.length){
							return tagName.getList(where_list);
						}else{
							return Promise.reject("不需要tagName");
						}
					}else{
						return Promise.reject("沒有資料")
					}
					
				})
				.then(function(list){
					for(var i in list){
						var data=list[i];
						$scope.cache.tag_name[data.id]=data.name;
					}
					$scope.$apply();
				})
				.catch(function(message){
					// $scope.cache.levelList[$scope.$ctrl.levelIndex].list=[];
					// console.log(message)
				})
			},500)
		}
		
		$scope.$watch("tag.name",$scope.get,1);
		$scope.$watch("cache.levelList",function(levelList){
			if(!levelList)return;
			
			$scope.$watch("cache.levelList["+($scope.$ctrl.levelIndex-1)+"].select",function(select){
				$scope.get();
				// console.log("第"+$scope.$ctrl.levelIndex+"層，select",select)
			},1);
			$scope.$watch("cache.levelList["+($scope.$ctrl.levelIndex)+"].list.length",function(length){
				if(length==0){
					delete $scope.cache.levelList[$scope.$ctrl.levelIndex].select;
				}
			})
		});
		
		$scope.add=function(name){
			tagName.nameToId(name)
			.then(function(list){
				var child_id=list.pop().id;
					
				if($scope.$ctrl.levelIndex==0){
					return child_id;
				}else if(isNaN(cache.levelList[$scope.$ctrl.levelIndex-1].select)){
					return Promise.reject("請選擇上一層")
				}else{
					if(cache.levelList[$scope.$ctrl.levelIndex-1].select==child_id){
						return Promise.reject("不能跟父層同名")
					}else{	
						var levelList_data=$scope.cache.levelList[$scope.$ctrl.levelIndex-1];
						var level_id=levelList_data.data.id;
						var id=levelList_data.select;
						var add={
							level_id:level_id,
							id:id,
							child_id:child_id,
						}
						return tagRelation.add(add)
						.then(function(item){
							return item.child_id;
						})
					}
				}
			})
			.then(function(id){
				var levelList_data=$scope.cache.levelList[$scope.$ctrl.levelIndex];
				var level_id=levelList_data.data.id;
				return tagRelationCount.add({
					level_id:level_id,
					id:id,
				});
			})
			.catch(function(message){
				alert(message)
				console.log(message)
			})
		}
		
		
		
		
		$scope.del=function(index){
			if(!confirm("確認刪除?")){
				return;
			}
			
			
			var levelList_data=$scope.cache.levelList[$scope.$ctrl.levelIndex];
			var level_id=levelList_data.data.id;
			var id=levelList_data.list[index].id;
			if($scope.$ctrl.levelIndex==0){
				tagRelationCount.del({
					level_id:level_id,
					id:id,
				})
				//第一層沒有關聯;
			}else{
				var child_level_id=level_id;
				var child_id=id;
				var levelList_data=$scope.cache.levelList[$scope.$ctrl.levelIndex-1];
				var level_id=levelList_data.data.id;
				var id=levelList_data.select;
				var del={
					level_id:level_id,
					id:id,
					child_id:child_id,
				}
				
				tagRelation.del(del)
				.then(function(arg){
					return tagRelationCount.del({
						level_id:child_level_id,
						id:child_id,
					});
				})
				.catch(function(message){
					console.log(message)
					return tagRelation.add(del);
				})
				
			}
		}
	}]
})
