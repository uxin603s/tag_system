angular.module("app").directive("tagRelationCount",['tagRelationCount','tagRelation',function(tagRelationCount,tagRelation) {
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
			
			$scope.getInner=function(ids){
				var arg={
					level_id:$scope.levelList[$scope.levelIndex].id,
					name:$scope.tag_name,
					ids:ids,
					pageData:$scope.pageData,
				}
				tagRelationCount.get(arg,function(res){
					console.log('第'+$scope.levelIndex+"層get tagRelationCount",arg,res);
					$scope.list=[];
					if(res.status){
						$scope.pageData=res.pageData;
						$scope.list=res.list;
						for(var i in res.list){
							var data=res.list[i];
							var id=data.id;
							if(!$scope.tagName[id]){
								$scope.searchTagNameTmp[id]=id;
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
					
					if($scope.levelIndex==0){
						$scope.getInner();
					}
					else if(isNaN($scope.tagIndex)){
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
							// $scope.tagIndex=undefined;
							var ids=[-1,];
							for(var i in res.list){
								ids.push(res.list[i].child_id);
							}
							$scope.getInner(ids);
							console.log('第'+$scope.levelIndex+"層get tagRelation",arg,res);
						})
					}
				},500)
			}
			$scope.$watch("levelList",$scope.get,1);
			$scope.$watch("levelIndex",$scope.get,1);
			$scope.$watch("tagIndex",$scope.get,1);
			
			// limit_count
			// limit_page
			// total_count

			$scope.add=function(){
				if(!isNaN($scope.tagIndex)){
					if(!$scope.tagList[$scope.tagIndex]){
						alert("請選擇上一層")
						return;
					}
					var arg={
						name:$scope.tag_name,
						level_id:$scope.levelList[$scope.levelIndex-1].id,
						id:$scope.tagList[$scope.tagIndex].id,
					}
					tagRelation.add(arg,function(res){
						$scope.tagList[$scope.tagIndex].count++;
						console.log('第'+$scope.levelIndex+"層insert關聯",arg,res)
					})
				}
				// console.log($scope.tagList,$scope.tagIndex)
				// return
				var arg={
					name:$scope.tag_name,
					level_id:$scope.levelList[$scope.levelIndex].id,
				}
				tagRelationCount.add(arg,function(res){
				
					console.log('第'+$scope.levelIndex+"層insert新增",arg,res)
					$scope.add_flag=true;
					$scope.list.push(res.insert);
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
						$scope.tagList[$scope.tagIndex].count--;
						console.log('第'+$scope.levelIndex+"層delete關聯",arg,res)
					})
				}
				
				var arg={
					id:$scope.list[index].id,
					level_id:$scope.levelList[$scope.levelIndex].id,
				}
				tagRelationCount.del(arg,function(res){
					console.log('第'+$scope.levelIndex+"層delete",arg,res)
					$scope.list.splice(index,1);
					$scope.add_flag=false;
					$scope.$apply();
				})
			}
			
			
			$scope.$watch("tag_name",function(value){
				$scope.get();
				if($scope.list){
					$scope.add_flag=$scope.list.some(function(value){
						return $scope.tagName[value.id]==$scope.tag_name;
					})
				}
			},1)
        },
    }
}]);