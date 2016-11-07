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
		
		$scope.get=function(){
			clearTimeout($scope.Timer);
			$scope.Timer=setTimeout(function(){
				promiseRecursive(function* (){
					var ids;
					if($scope.tag.name){//搜尋模式
						var list=yield tagName.nameToId("%"+$scope.tag.name+"%",1)
						if(list.length){
							var ids=list.map(function(val){
								return val.id;
							});
						}
					}
					if($scope.$ctrl.levelIndex){
						if(isNaN(cache.levelList[$scope.$ctrl.levelIndex-1].select)){
							$scope.cache.levelList[$scope.$ctrl.levelIndex].list=[];
							$scope.$apply();
							yield Promise.reject("沒選上一層");
						}else{
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
							var res= yield tagRelation.get(where_list);
							var child_ids=[];
							if(res.status){
								var ids=res.list.map(function(val){
									return val.child_id;
								})
							}else{
								$scope.cache.levelList[$scope.$ctrl.levelIndex].list=[];
								$scope.$apply();
								yield Promise.reject("沒有關聯");
							}
						}
					}
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
					var res=yield tagRelationCount.get(where_list);
					// console.log($scope.$ctrl.levelIndex,res)
					if(res.status){
						// console.log(res.list);
						$scope.cache.levelList[$scope.$ctrl.levelIndex].list=res.list;
						var ids=res.list.map(function(val){
							return val.id;
						})
						yield tagName.idToName(ids);
						$scope.$apply();
					}else{
						yield Promise.reject("tagRelationCount 沒資料");
					}
				}())
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
			promiseRecursive(function* (name){
				var list=yield tagName.nameToId(name);
				var child_id=list.pop().id;
					
				if($scope.$ctrl.levelIndex){
					if(isNaN(cache.levelList[$scope.$ctrl.levelIndex-1].select)){
						var message="請選擇上一層"
						alert(message);
						yield Promise.reject(message);
					}else{
						if(cache.levelList[$scope.$ctrl.levelIndex-1].select==child_id){
							var message="不能跟父層同名"
							alert(message);
							yield Promise.reject(message);
						}else{	
							var levelList_data=$scope.cache.levelList[$scope.$ctrl.levelIndex-1];
							var level_id=levelList_data.data.id;
							var id=levelList_data.select;
							var add={
								level_id:level_id,
								id:id,
								child_id:child_id,
							}
							var item=yield tagRelation.add(add);
							var child_id=item.child_id;
						}
					}
				}
				// console.log($scope.$ctrl.levelIndex)
				var levelList_data=$scope.cache.levelList[$scope.$ctrl.levelIndex];
				var level_id=levelList_data.data.id;
				
				yield tagRelationCount.add({
					level_id:level_id,
					id:child_id,
				})
				.catch(function(message){
					alert(message)
					console.log(message)
				});
				
				// console.log($scope.tag);
				
				$scope.tag.name='';
				$scope.$apply();
			}(name))
		}
		
		$scope.del=function(index){
			if(!confirm("確認刪除?")){
				return;
			}
			promiseRecursive(function* (index){
				var levelList_data=$scope.cache.levelList[$scope.$ctrl.levelIndex];
				var level_id=levelList_data.data.id;
				var id=levelList_data.list[index].id;
				var child_level_id=level_id;
				var child_id=id;
				
				if($scope.$ctrl.levelIndex){//第一層沒有關聯;
					let levelList_data=$scope.cache.levelList[$scope.$ctrl.levelIndex-1];
					let level_id=levelList_data.data.id;
					let id=levelList_data.select;
					var del={
						level_id:level_id,
						id:id,
						child_id:child_id,
					}
					yield tagRelation.del(del);
				}
				var result=yield tagRelationCount.del({
					level_id:level_id,
					id:id,
				})
				// console.log(result,del)
				if(!result.status && del){
					yield tagRelation.add(del);
				}
				
			}(index));
		}
	}]
});