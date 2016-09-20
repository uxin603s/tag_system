angular.module("app").directive("tagRelationCount",['tagRelationCount','tagRelation',function(tagRelationCount,tagRelation) {
    return {
		templateUrl: 'app/directives/tagRelationCount/tagRelationCount.html?t='+Date.now(),
		restrict: 'E',
		replace:true,
		scope:{
			tagName:'=',
			searchTagNameTmp:'=',
			
			id:'=',
			levelList:'=',
			index:'=',
		},
        link: function($scope,$element,$attr) {
			$scope.getList=function(){
				if(!$scope.levelList || !$scope.levelList[$scope.index])return;
				
				// if($scope.id!=-1 && $scope.id){
					// var arg={
						// level_id:$scope.levelList[$scope.index-1].id,
						// id:$scope.id,
					// }
					// tagRelation.get(arg,function(res){
						// var ids=[];
						// for(var i in res.list){
							// ids.push(res.list[i].child_id);
						// }
						// var arg={
							// level_id:$scope.levelList[$scope.index].id,
							// name:$scope.tag_name,
							// ids:ids,
						// }
						// tagRelationCount.get(arg,function(res){
							// $scope.list=[];
							// if(res.status){
								// $scope.pageData=res.pageData;
								// $scope.list=res.list;
								// for(var i in res.list){
									// var data=res.list[i];
									// var id=data.id;
									// if(!$scope.tagName[id]){
										// $scope.searchTagNameTmp[id]=id;
									// }
								// }
							// }
							// $scope.$apply();
						// })
					// })
				// }
				// else{
					var arg={
						level_id:$scope.levelList[$scope.index].id,
						name:$scope.tag_name,
					}
					
					tagRelationCount.get(arg,function(res){
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
				// }
				
				
			}
			$scope.$watch("levelList",$scope.getList,1)
			$scope.$watch("index",$scope.getList,1)
			$scope.$watch("id",$scope.getList,1)
			
			$scope.insert=function(){
				
				if($scope.id!=-1 && $scope.id){
					var arg={
						name:$scope.tag_name,
						level_id:$scope.levelList[$scope.index-1].id,
						id:$scope.id,
					}
					tagRelation.add(arg,function(res){
						console.log(res)
					})
				}
				
				var arg={
					name:$scope.tag_name,
					level_id:$scope.levelList[$scope.index].id,
				}
				tagRelationCount.add(arg,function(res){
					$scope.add_flag=true;
					$scope.getList();
					$scope.$apply();
				})
			}
			$scope.delete=function(index){
				if($scope.id!=-1 && $scope.id){
					var arg={
						id:$scope.id,
						child_id:$scope.list[index].id,
						level_id:$scope.levelList[$scope.index-1].id,
					}
					tagRelation.del(arg,function(res){
						console.log(res)
					})
				}
				var arg={
					id:$scope.list[index].id,
					level_id:$scope.levelList[$scope.index].id,
				}
				tagRelationCount.del(arg,function(res){
					$scope.list.splice(index,1);
					$scope.add_flag=false;
					$scope.$apply();
				})
			}
			
			
			
			$scope.$watch("tag_name",function(value){
				$scope.getList();
				// console.log($scope.list)
				if($scope.list){
					$scope.add_flag=$scope.list.some(function(value){
						return $scope.tagName[value.id]==$scope.tag_name;
					})
				}
			},1)
        },
    }
}]);