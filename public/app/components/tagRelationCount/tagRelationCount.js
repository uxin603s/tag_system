angular.module("app").component("tagRelationCount",{
	bindings:{
		levelIndex:"=",
	},
	templateUrl:'app/components/tagRelationCount/tagRelationCount.html?t='+Date.now(),
	controller:["$scope","cache","tagName","tagRelation",function($scope,cache,tagName,tagRelation){
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
		var get_list=function(ids){
			return new Promise(function(resolve,reject) {
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
				var post_data={
					func_name:'TagRelationCount::getList',
					arg:{
						where_list:where_list,
					},
				}
				$.post("ajax.php",post_data,function(res){
					if(res.status){
						var list=res.list;
						$scope.cache.levelList[$scope.$ctrl.levelIndex].list=list;
						resolve(list);
					}else{
						reject("沒有資料")
					}
					$scope.$apply();
				},"json")
			});
		}
		
		$scope.get=function(){
			// console.log($scope.$ctrl.levelIndex)
			clearTimeout($scope.Timer);
			$scope.Timer=setTimeout(function(){
				search_tag_name()
				.then(function(ids){
					return search_select_tag(ids);
				})
				.then(function(ids){
					return get_list(ids);
				})
				.then(function(list){
					$scope.cache.tag_name || ($scope.cache.tag_name={});
					var where_list=[];
					for(var i in list){
						var id=list[i].id;
						if(!$scope.cache.tag_name[id]){
							where_list.push({field:'id',type:0,value:id})
						}
					}
					// console.log(where_list)
					if(where_list.length){
						return tagName.getList(where_list);
					}else{
						return Promise.reject("不需要tagName");
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
			// return
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
		
		
		var TagRelationCount_insert=function(id){
			return new Promise(function(resolve,reject) {
				var levelList_data=$scope.cache.levelList[$scope.$ctrl.levelIndex];
				var level_id=levelList_data.data.id;
				var post_data={
					func_name:'TagRelationCount::insert',
					arg:{
						level_id:level_id,
						id:id,
					},
				}
				$.post("ajax.php",post_data,function(res){
					$scope.cache.levelList[$scope.$ctrl.levelIndex].list.push(res)
					$scope.$apply();
				},"json")
			})
		}
		
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
				return TagRelationCount_insert(id);
			})
			.catch(function(message){
				alert(message)
				console.log(message)
			})
		}
		
		
		var TagRelationCount_delete=function(index){
			var id=$scope.cache.levelList[$scope.$ctrl.levelIndex].list[index].id;
			
			var levelList_data=$scope.cache.levelList[$scope.$ctrl.levelIndex];
			var level_id=levelList_data.data.id;
			
			return new Promise(function(resolve,reject) {
				var post_data={
					func_name:'TagRelationCount::delete',
					arg:{
						level_id:level_id,
						id:id,
					},
				}
				$.post("ajax.php",post_data,function(res){
					if(res.status){
						$scope.cache.levelList[$scope.$ctrl.levelIndex].list.splice(index,1);
						resolve(id);
					}else{
						reject("TagRelationCount刪除失敗");
					}
					$scope.$apply();
				},"json")
			})
		}
		
		$scope.del=function(index){
			if(!confirm("確認刪除?")){
				return;
			}
			var child_id=$scope.cache.levelList[$scope.$ctrl.levelIndex].list[index].id;
			if($scope.$ctrl.levelIndex==0){
				TagRelationCount_delete(index).then(function(){
					$scope.$apply();
				})
				//第一層沒有關聯;
			}else{
				var levelList_data=$scope.cache.levelList[$scope.$ctrl.levelIndex-1];
				var level_id=levelList_data.data.id;
				var id=levelList_data.select;
				var del={
					level_id:level_id,
					id:id,
					child_id:child_id,
				}
				tagRelation.del(del)
				.then(function(){
					return TagRelationCount_delete(index);
				})
				.catch(function(message){
					console.log(message)
					return tagRelation.add(del);
				})
				
			}
		}
	}]
})
