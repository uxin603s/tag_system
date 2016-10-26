angular.module("app").component("tagRelationCount",{
	bindings:{
		levelIndex:"=",
	},
	templateUrl:'app/components/tagRelationCount/tagRelationCount.html?t='+Date.now(),
	controller:["$scope","cache",function($scope,cache){
		$scope.cache=cache;
		// console.log(cache)
		$scope.tmp=$scope.$watch("cache.levelList["+$scope.$ctrl.levelIndex+"]",function(value){
			if(!value)return;
			// console.log($scope.$ctrl.levelIndex,value)
			$scope.$watch("cache.levelList["+$scope.$ctrl.levelIndex+"].select",function(value){
				// if(!value)return;
				for(var i in $scope.cache.levelList){
					if(i>$scope.$ctrl.levelIndex){
						$scope.cache.levelList[i].list=[];
						// delete $scope.cache.levelList[i].select;
					}
				}
				// console.log("第"+$scope.$ctrl.levelIndex+"層，select",value)
				$scope.get();
			},1);
			$scope.$watch("cache.levelList["+$scope.$ctrl.levelIndex+"].data",function(value){
				if(!value)return;
				// console.log("第"+$scope.$ctrl.levelIndex+"層，init",$scope.cache.levelList[$scope.$ctrl.levelIndex].list)
				if($scope.$ctrl.levelIndex!=0){
					$scope.p_level_id=$scope.cache.levelList[$scope.$ctrl.levelIndex-1].data.id
				}
				$scope.level_id=value.id;
				$scope.get();
			},1)
			$scope.tmp();
		},1)
		var get_list=function(ids){
			var where_list=[
				{field:'level_id',type:0,value:$scope.level_id},
			];
			if(ids){
				for(var i in ids){
					var id=ids[i];
					where_list.push({field:'id',type:0,value:id})
				}
			}
			// console.log(ids)
			var post_data={
				func_name:'TagRelationCount::getList',
				arg:{
					where_list:where_list,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					$scope.cache.levelList[$scope.$ctrl.levelIndex].list=res.list;
				}
				$scope.$apply();
			},"json")
		}
		
		$scope.get=function(){
			$scope.cache.levelList[$scope.$ctrl.levelIndex].list=[];
			// console.log($scope.$ctrl.levelIndex)
			if($scope.$ctrl.levelIndex==0){
				get_list();
			}
			else if(!isNaN(cache.levelList[$scope.$ctrl.levelIndex].select)){
				// console.log("有選")
				var where_list=[
					{field:'level_id',type:0,value:$scope.p_level_id},
					{field:'id',type:0,value:cache.levelList[$scope.$ctrl.levelIndex].select},
				];
				var post_data={
					func_name:'TagRelation::getList',
					arg:{
						where_list:where_list,
					},
				}
				$.post("ajax.php",post_data,function(res){
					if(res.status){
						var ids=[]
						for(var i in res.list){
							ids.push(res.list[i].child_id);
						}
						get_list(ids);
					}
					$scope.$apply();
				},"json")
			}else{
				// get_list();
				// console.log("沒選")
			}
		}
		
		$scope.nameToId=function(name,callback){
			var post_data={
				func_name:'TagName::insert',
				arg:{
					name:name,
				},
			}
			$.post("ajax.php",post_data,function(res){
				callback && callback(res.id)
			},"json")
		}
		$scope.add=function(name){
			$scope.nameToId(name,function(id){
				if(cache.levelList[$scope.$ctrl.levelIndex].select==id){
					alert("不能跟父層同名");
					return;
				}
					
				if($scope.$ctrl.levelIndex!=0){
					if(isNaN(cache.levelList[$scope.$ctrl.levelIndex].select)){
						alert("請選擇上一層");
						return;
					}
				}
				var post_data={
					func_name:'TagRelationCount::insert',
					arg:{
						level_id:$scope.level_id,
						id:id,
					},
				}
				$.post("ajax.php",post_data,function(res){
					$scope.cache.levelList[$scope.$ctrl.levelIndex].list.push(res)
					if(!isNaN(cache.levelList[$scope.$ctrl.levelIndex].select)){
						var post_data={
							func_name:'TagRelation::insert',
							arg:{
								level_id:$scope.p_level_id,
								id:cache.levelList[$scope.$ctrl.levelIndex].select,
								child_id:id,
							},
						}
						$.post("ajax.php",post_data,function(res){
							if(res.status){
								var data=cache.levelList[$scope.$ctrl.levelIndex-1];
								var find_data=data.list.find(function(value){
									return value.id==cache.levelList[$scope.$ctrl.levelIndex].select
								})
								if(find_data){
									find_data.count++;
								}
								$scope.$apply();
							}
						},"json")
					}
					$scope.$apply();
				},"json")
			});
		}
		$scope.del=function(id){
			var post_data={
				func_name:'TagRelation::delete',
				arg:{
					level_id:$scope.p_level_id,
					id:$scope.cache.levelList[$scope.$ctrl.levelIndex].select,
				},
			}
			$.post("ajax.php",post_data,function(res){
				// console.log(res)
				if(res.status){
					var data=cache.levelList[$scope.$ctrl.levelIndex-1];
					var find_data=data.list.find(function(value){
						return value.id==cache.levelList[$scope.$ctrl.levelIndex].select
					})
					if(find_data){
						find_data.count--;
					}
				}
				var post_data={
					func_name:'TagRelationCount::delete',
					arg:{
						p_level_id:$scope.p_level_id,
						level_id:$scope.level_id,
						id:id,
					},
				}
				$.post("ajax.php",post_data,function(res){
					if(res.status){
						var index=$scope.cache.levelList[$scope.$ctrl.levelIndex].list.findIndex(function(value){
							return value.id==id
						})
						if(index!=-1)
						$scope.cache.levelList[$scope.$ctrl.levelIndex].list.splice(index,1);
					}
					$scope.$apply();
				},"json")
				$scope.$apply();
			},"json")
			
			
		}
	}]
})
