angular.module("app").component("tagRecusion",{
	bindings:{
		editMode:"=",
		
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
		
		clickSearch:"=",//選擇的標籤
	},
	templateUrl:'app/components/tagRecusion/tagRecusion.html?t='+Date.now(),
	controller:["$scope","tagRelation","tagName",function($scope,tagRelation,tagName){
		$scope.level_id=$scope.$ctrl.levelList[$scope.$ctrl.levelIndex].id;		
		
		$scope.search={tagName:''};
		var get_list=function(select,levelIndex){
			if(!levelIndex){
				levelIndex=0;
			}
			var level_id=$scope.$ctrl.levelList[levelIndex].id;
			var where_list=[
				{field:'level_id',type:0,value:level_id},
				{field:'id',type:0,value:select?select:0},
			];
			return tagRelation.get(where_list);
		}
		if($scope.$ctrl.selectListCollect){
			//init selectListCollect
			var init=function(){
				promiseRecursive(function* (){
					if($scope.$ctrl.lockLv1){
						var res=yield get_list();
						if(res.status){
							var list=res.list
							list.sort(function(a,b){
								return a.sort_id-b.sort_id;
							})
							var cut=$scope.$ctrl.selectListCollect.length-list.length
							if(cut>0){
								$scope.$ctrl.selectListCollect.splice(list.length,cut);
							}
							
							for(var i in list){
								var select=list[i].child_id;
								if(!$scope.$ctrl.selectListCollect[i]){
									$scope.$ctrl.selectListCollect.push([])
								}
								
								for(var j in $scope.$ctrl.levelList){
									if(!$scope.$ctrl.selectListCollect[i][j]){
										$scope.$ctrl.selectListCollect[i].push({})
									}
									if(j==0){
										$scope.$ctrl.selectListCollect[i][j].select=select;
									}
									
								}
								var cut=$scope.$ctrl.selectListCollect[i].length-$scope.$ctrl.levelList.length
								if(cut>0){
									$scope.$ctrl.selectListCollect[i].splice($scope.$ctrl.levelList.length,cut);
								}
							}
							// console.log($scope.$ctrl.selectListCollect)
							
							$scope.$apply();
						}
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
						var cut=$scope.$ctrl.selectListCollect[0].length-$scope.$ctrl.levelList.length
						if(cut>0){
							$scope.$ctrl.selectListCollect[0].splice($scope.$ctrl.levelList.length,cut);
						}
					}
				}())
			}
			$scope.$watch("$ctrl.lockLv1",init,1)
			$scope.$watch("$ctrl.levelList",init,1)
			//watch click
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
						}else if(last){
							var p_last_level_id=$scope.$ctrl.levelList[last-1].id;
							var last_level_id=$scope.$ctrl.levelList[last].id;
							var select=selectList[last-1].select;
							var relation=$scope.$ctrl.relation[last_level_id];
							if(relation){
								var list=relation[select]
								// console.log(list)
								if(list && Object.keys(list).length){
									for(var child_id in list){
										var name=$scope.$ctrl.tagName[child_id];
										var index=$scope.$ctrl.clickSearch.findIndex(function(val){
											return val.name==name;
										})
										if(index==-1)
											$scope.$ctrl.clickSearch.push({name:name,type:1});
									}
								}else{
									if(select){
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
				},0)
			}
			$scope.$watch("$ctrl.selectListCollect",watch_selectListCollect,1)
			$scope.$watch("$ctrl.relation",watch_selectListCollect,1)
			$scope.$watch("$ctrl.tagName",watch_selectListCollect,1)
		}else{
			$scope.add=function(search){
				promiseRecursive(function* (){
					var res=yield tagName.nameToId(search.tagName);
					var select=$scope.$ctrl.select?$scope.$ctrl.select:0;
					var sort_id=0;
					if($scope.$ctrl.relation[$scope.level_id]){
						if($scope.$ctrl.relation[$scope.level_id][select])
							sort_id=Object.keys($scope.$ctrl.relation[$scope.level_id][select]).length;
					}
					var add={
						level_id:$scope.level_id,
						id:select,
						child_id:res[0].id,
						sort_id:sort_id,
					}
					tagRelation.add(add);
					search.tagName='';
				}())
			}
			$scope.del=function(index){
				var del=angular.copy($scope.list[index]);
				tagRelation.del(del)
				.then(function(res){
					if(res.status){
						$scope.list.splice(index,1)
						$scope.$apply();
					}
				})
			}
			var watch_list=function(value){
				$scope.list=[];
				if($scope.$ctrl.relation[$scope.level_id]){
					var relation=$scope.$ctrl.relation[$scope.level_id][$scope.$ctrl.select?$scope.$ctrl.select:0];
					if(relation){
						var select=$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select
						if(!relation[select]){
							delete $scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select
						}
						for(var i in relation){
							$scope.list.push(relation[i])
						}
					}
				}
				$scope.list.sort(function(a,b){
					return a.sort_id-b.sort_id;
				})
				
				if($scope.list.length){					
					if($scope.$ctrl.levelList.length-1!=$scope.$ctrl.levelIndex)
					if(!$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select){
						var child_id=$scope.list[0].child_id;
						get_list(child_id,$scope.$ctrl.levelIndex+1)
						.then(function(res){
							if(res.status){
								$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select=child_id;
								$scope.$apply();
							}
						})						
					}
				}
			}
			
			$scope.$watch("$ctrl.select",function(value){
				get_list(value,$scope.$ctrl.levelIndex);
				watch_list(value);
			},1)
			$scope.$watch("$ctrl.selectList["+$scope.$ctrl.levelIndex+"].select",function(select){
				if(!select){
					if($scope.$ctrl.selectList[$scope.$ctrl.levelIndex+1]){
						delete $scope.$ctrl.selectList[$scope.$ctrl.levelIndex+1].select
					}
				}
			},1)
			$scope.$watch("$ctrl.relation["+$scope.level_id+"]",watch_list,1)
			$scope.$watch("list",function(curr,prev){
				if(!curr)return;
				if(!prev)return;
				if(curr.length!=prev.length)return;
				// console.log(curr,prev)
				
				for(var i in curr){
					// console.log(curr[i],prev[i])
					if(curr[i].child_id!=prev[i].child_id){
						var where=angular.copy(curr[i]);
						delete where.sort_id
						var update={sort_id:i};
						var ch={
							update:update,
							where:where
						}
						curr[i].sort_id=i;
						
						tagRelation.ch(ch)
						.then(function(res){
							console.log(res)
						})
					}
				}
			},1)
			
		}
	}]
});