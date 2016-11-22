angular.module("app").component("tagRecusion",{
	bindings:{
		editMode:"=",
		count:"=",//count 快取
		relation:"=",//relation快取
		levelList:"=",//階層資料
		tagName:"=",//標籤名稱
		
		levelIndex:"=",//第幾層
		select:"=",//這層選
		selectList:"=",
		selectListCollect:"=",
		
		childIds:"=",
		lockLv1:"=",//第一層鎖定
		mode:"=",//標籤是否用按鈕顯示
		
		func:"=",//使用的func
		clickSearch:"=",//選擇的標籤
	},
	templateUrl:'app/components/tagRecusion/tagRecusion.html?t='+Date.now(),
	controller:["$scope",function($scope){
		$scope.level_id=$scope.$ctrl.levelList[$scope.$ctrl.levelIndex].id;		
		
		$scope.search={tagName:''};
		
		var get_list=function(){
			$scope.watch_sort && $scope.watch_sort();
			var childIds=$scope.$ctrl.childIds;
			$scope.list=[];
			var count=$scope.$ctrl.count[$scope.level_id];
			if(!count)return
			if(childIds){
				for(var i in childIds){
					if(count[i]){
						$scope.list.push(count[i])
					}
				}
				$scope.list.sort(function(a,b){
					return childIds[a.id].sort_id-childIds[b.id].sort_id;
				})
				$scope.list.map(function(val,index){
					childIds[val.id].sort_id=index;
				})
			}else{
				for(var i in count){
					if(count[i]){
						var item=count[i];
						$scope.list.push(item)
					}
				}
				$scope.list.sort(function(a,b){
					return a.sort_id-b.sort_id;
				})
				$scope.list.map(function(val,index){
					val.sort_id=index
				})
				
			}
			if($scope.$ctrl.func){
				var sort=$scope.$ctrl.func.sort.bind(this,$scope.$ctrl.levelIndex,$scope.$ctrl.select)
				$scope.watch_sort=$scope.$watch("list",sort,1)
			}
			// console.log($scope.$ctrl.selectList[$scope.$ctrl.levelIndex],$scope.$ctrl.levelIndex)
			if($scope.$ctrl.selectList)
			if(!$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select){
				if($scope.list.length)
					if($scope.$ctrl.levelList.length-1!=$scope.$ctrl.levelIndex){
						if(count[$scope.list[0].id].count){
							$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select=$scope.list[0].id;
						}
					}
			}
			
		}
		var get_child=function(select){
			if($scope.$ctrl.relation[$scope.level_id])
			if($scope.$ctrl.relation[$scope.level_id][select]){
				$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].childIds=$scope.$ctrl.relation[$scope.level_id][select];
			}else{
				$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].childIds={};
			}
		}
		
		
		$scope.$watch("$ctrl.childIds",function(){
			get_list();
			if($scope.$ctrl.levelIndex && $scope.$ctrl.childIds){
				var select=$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select;
				var childIds=$scope.$ctrl.childIds;
				if(!childIds[select]){
					delete $scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select;
				}
			}
			if($scope.$ctrl.func){
				// console.log($scope.$ctrl.levelIndex)
				$scope.$ctrl.func.get_count($scope.$ctrl.levelIndex,$scope.$ctrl.childIds);
			}
		},1);
		
		if($scope.$ctrl.selectList){
			$scope.$watch("$ctrl.selectList["+$scope.$ctrl.levelIndex+"].select",function(select){
				if($scope.$ctrl.func)
					$scope.$ctrl.func.get_relation($scope.$ctrl.levelIndex,select);
				
				get_child($scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select)
			},1);
			$scope.$watch("$ctrl.relation["+$scope.level_id+"]",function(){
				get_child($scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select)
			},1);
		}
		
		$scope.$watch("$ctrl.count["+$scope.level_id+"]",function(count){
			get_list();
		},1);
		
		if($scope.$ctrl.selectListCollect){
			var watch_selectListCollect=function(){
				clearTimeout($scope.watch_selectListCollect);
				$scope.watch_selectListCollect=setTimeout(function(){
					$scope.$ctrl.clickSearch.splice(0,$scope.$ctrl.clickSearch.length);
					
					for(var i in $scope.$ctrl.selectListCollect){
						var selectList=angular.copy($scope.$ctrl.selectListCollect[i]);
						if(selectList.length!=$scope.$ctrl.levelList.length)continue;
						var last=$scope.$ctrl.levelList.length-1;
						
						var select=selectList[last].select;
						if(select){
							var name=$scope.$ctrl.tagName[select];
							if(name){
								var index=$scope.$ctrl.clickSearch.findIndex(function(val){
									return val.name==name;
								})
								if(index==-1)
									$scope.$ctrl.clickSearch.push({name:name});
							}
						}else{		
							var p_last_level_id=$scope.$ctrl.levelList[last-1].id;
							var select=selectList[last-1].select;
							if($scope.$ctrl.relation[p_last_level_id]){
								var list=$scope.$ctrl.relation[p_last_level_id][select];
									
								if(list && Object.keys(list).length){
									
									for(var id in list){
										var name=$scope.$ctrl.tagName[id];
										// console.log($scope.$ctrl.tagName,id,name)
										if(name){
											var index=$scope.$ctrl.clickSearch.findIndex(function(val){
												return val.name==name;
											})
											if(index==-1)
												$scope.$ctrl.clickSearch.push({name:name,type:1});
										}
									}
								}else{
									
									if(select && last){
										var name=$scope.$ctrl.tagName[select];
										var index=$scope.$ctrl.clickSearch.findIndex(function(val){
											return val.name==name;
										})
										if(index==-1)
											$scope.$ctrl.clickSearch.push({name:name});
									}
								}
							}
						}
					}
					$scope.$apply();
				},50)
			}
			$scope.$watch("$ctrl.selectListCollect",watch_selectListCollect,1)
			$scope.$watch("$ctrl.relation",watch_selectListCollect,1)
			$scope.$watch("$ctrl.tagName",watch_selectListCollect,1)
			
			var watch_select_list=function(){
				
				clearTimeout($scope.watch_select_list_timer);
				$scope.watch_select_list_timer=setTimeout(function(){
					if($scope.$ctrl.lockLv1){
						promiseRecursive(function* (){
							var level_id=$scope.$ctrl.levelList[0].id
							var res=yield $scope.$ctrl.func.get_count(0);
							// console.log(res.list)//$scope.$ctrl.count[level_id],
							if(res.status){
								var list=res.list.sort(function(a,b){
									return a.sort_id-b.sort_id;
								})
								
								// $scope.$ctrl.count[level_id];
								var cut=$scope.$ctrl.selectListCollect.length-list.length
								
								if(cut>0){
									$scope.$ctrl.selectListCollect.splice(list.length,cut);
								}
								if(cut<0){
									$scope.$ctrl.selectListCollect.splice(0,$scope.$ctrl.selectListCollect.length);
								}
								// console.log(list)
								for(var i in list){
									var select=list[i].id
									if(!$scope.$ctrl.selectListCollect[i]){
										$scope.$ctrl.selectListCollect.push([])
									}
									for(var j in $scope.$ctrl.levelList){
										if($scope.$ctrl.selectListCollect[i][j]){
											// $scope.$ctrl.selectListCollect[i][j].select
											if(!$scope.$ctrl.selectListCollect[i][j].select){
												if(j==0){
													$scope.$ctrl.selectListCollect[i][j].select=select;
													var res=yield $scope.$ctrl.func.get_relation(j,select);
													
													if(res.status){
														var childIds=$scope.$ctrl.relation[level_id][select]
													}else{
														var childIds={};
													}
													
													$scope.$ctrl.selectListCollect[i][j].select=select
													$scope.$ctrl.selectListCollect[i][j].childIds=childIds
												}
											}
										
										}else{
											var res=yield $scope.$ctrl.func.get_relation(j,select);
											
											if(res.status){
												var childIds=$scope.$ctrl.relation[level_id][select]
											}else{
												var childIds={};
											}
											$scope.$ctrl.selectListCollect[i].push({select:select,childIds:childIds})
										}
										
									}
								}
								$scope.$apply();
							}
						}())
					}else{
						$scope.$ctrl.selectListCollect.splice(1,$scope.$ctrl.selectListCollect.length)
						if(!$scope.$ctrl.selectListCollect[0]){
							$scope.$ctrl.selectListCollect[0]=[];
						}
						for(var i in $scope.$ctrl.levelList){
							if(!$scope.$ctrl.selectListCollect[0][i]){
								$scope.$ctrl.selectListCollect[0].push({})
							}
						}
						$scope.$apply();
					}
				},500)
			}
			$scope.$watch("$ctrl.lockLv1",watch_select_list)
		}
	}]
});