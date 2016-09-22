angular.module("app").directive("tagRelationCount",['tagRelationCount','tagRelation','level',function(tagRelationCount,tagRelation,level) {
    return {
		templateUrl: 'app/directives/tagRelationCount/tagRelationCount.html?t='+Date.now(),
		restrict: 'E',
		replace:true,
		scope:{
			tagName:'=',
			searchTagNameTmp:'=',
			
			tagList:'=',
			tagIndex:'=?',
			
			levelList:'=',
			levelIndex:'=',
		},
        link: function($scope,$element,$attr) {
			$scope.update_level=function(update){
				var arg={
					where:{
						api_id:$scope.user_config.select_api_id,
						id:$scope.levelList[$scope.levelIndex].id,
					},
					update:update,
				}
				level.update(arg,function(res){
					console.log(res)
					$scope.get();
					$scope.$apply();
				})
			}
			$scope.del_level=function(){
				// console.log($scope.levelList,$scope.levelIndex)
				var arg={
					api_id:$scope.user_config.select_api_id,
					id:$scope.levelList[$scope.levelIndex].id,
				}
				level.del(arg,function(res){
					console.log(res)
					if(res.status){
						$scope.levelList.splice($scope.levelIndex,1);
						$scope.$apply();
					}
				})
			}
			$scope.getInner=function(ids){
				var arg={
					level_id:$scope.levelList[$scope.levelIndex].id,
					name:$scope.tag_name,
					ids:ids,
					pageData:$scope.user_config.pageData[$scope.levelIndex],
				}
				tagRelationCount.get(arg,function(res){
					// console.log('第'+$scope.levelIndex+"層get tagRelationCount",arg,res);
					$scope.list=[];
					$scope.add_flag=false;
					if(res.status){
						$scope.user_config.pageData[$scope.levelIndex]=res.pageData;
						$scope.list=res.list;
						for(var i in res.list){
							var data=res.list[i];
							var id=data.id;
							if(!$scope.tagName[id]){
								$scope.searchTagNameTmp[id]=id;
							}
							if($scope.tagName[id]==$scope.tag_name){
								$scope.add_flag=true
							}
						}
					}
					
					$scope.$apply();
				})
			}
			$scope.get=function(){
				if(!$scope.levelList || !$scope.levelList[$scope.levelIndex])return;
				clearTimeout($scope.getTimer)
				$scope.getTimer=setTimeout(function(){
					$scope.user_config.pageData || ($scope.user_config.pageData={})
					$scope.user_config.pageData[$scope.levelIndex] || ($scope.user_config.pageData[$scope.levelIndex]={
						total_count:0,
						limit_page:0,
						limit_count:10,
					});
					$scope.user_config.pageData[$scope.levelIndex].total_count=0;
					if($scope.levelList[$scope.levelIndex].sync_relation){
						$scope.getInner();
					}else{
						if($scope.levelIndex==0){
							$scope.user_config.tailData={}
							$scope.getInner();
						}
						else if(isNaN($scope.tagIndex)){
							$scope.list=[];
							return;
						}
						else if($scope.levelIndex!=0){
							if(!$scope.tagList[$scope.tagIndex]){
								$scope.list=[];
								return;
							}
							var arg={
								id:$scope.tagList[$scope.tagIndex].id,
								level_id:$scope.levelList[$scope.levelIndex-1].id,
							}
							tagRelation.get(arg,function(res){
								var ids=[-1,];
								for(var i in res.list){
									ids.push(res.list[i].child_id);
								}
								$scope.getInner(ids);
								$scope.$apply();
								// console.log('第'+$scope.levelIndex+"層get tagRelation",arg,res);
							})
						}
						
					}
				},500)
			}
			
			$scope.add=function(){
				if(!$scope.levelList[$scope.levelIndex].sync_relation){
					if($scope.levelIndex!=0){//第一層沒有上層
						if(isNaN($scope.tagIndex)){
							alert("請選擇上一層")
							return
						}else{
							var arg={
								name:$scope.tag_name,
								level_id:$scope.levelList[$scope.levelIndex-1].id,
								id:$scope.tagList[$scope.tagIndex].id,
							}
							tagRelation.add(arg,function(res){
								$scope.tagList[$scope.tagIndex].count++;
								// console.log('第'+$scope.levelIndex+"層insert關聯",arg,res)
								$scope.$apply();
							})
						}
					}
				}
				
				var arg={
					name:$scope.tag_name,
					level_id:$scope.levelList[$scope.levelIndex].id,
				}
				tagRelationCount.add(arg,function(res){
					// console.log('第'+$scope.levelIndex+"層insert新增",arg,res)
					$scope.add_flag=true;
					$scope.list.push(res.insert);
					$scope.user_config.pageData[$scope.levelIndex].total_count++;
					var id=res.insert.id;
					if(!$scope.tagName[id]){
						$scope.searchTagNameTmp[id]=id;
					}
					$scope.$apply();
				})
			}
			
			$scope.del=function(index){
				if(!isNaN($scope.tagIndex)){
					var arg={
						id:$scope.tagList[$scope.tagIndex].id,
						child_id:$scope.list[index].id,
						level_id:$scope.levelList[$scope.levelIndex-1].id,
					}
					tagRelation.del(arg,function(res){
						if(res.status){
							$scope.list.splice(index,1);
							$scope.tagList[$scope.tagIndex].count--;
							// console.log('第'+$scope.levelIndex+"層delete關聯",arg,res)
							$scope.$apply();
						}
					})
				}
				
				var arg={
					id:$scope.list[index].id,
					p_level_id:$scope.levelList[$scope.levelIndex-1].id,
					level_id:$scope.levelList[$scope.levelIndex].id,
				}
				tagRelationCount.del(arg,function(res){
					if(res.status){
						// console.log('第'+$scope.levelIndex+"層delete",arg,res)
						$scope.list.splice(index,1);
						$scope.user_config.pageData[$scope.levelIndex].total_count--;
						$scope.add_flag=false;
						$scope.$apply();
					}
				})
			}
			$scope.$watch("levelList",$scope.get,1)
			$scope.$watch("tagIndex",$scope.get,1)
			$scope.$watch("tag_name",$scope.get,1)
        },
    }
}]);