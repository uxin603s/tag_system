angular.module("app").directive("tagRelationCount",['$parse','$timeout',function($parse,$timeout) {
    return {
		templateUrl: 'app/directives/tagRelationCount/tagRelationCount.html?t='+Date.now(),
		restrict: 'E',
		replace:true,
		scope:{
			tagName:'=',
			searchTagNameTmp:'=',
			data:'=',
		},
        link: function($scope,$element,$attr) {
			$scope.getList=function(){
				
				var timer_name='getListTimer';
				clearTimeout($scope[timer_name]);
				$scope[timer_name]=setTimeout(function(){
					
					var post_data={
						func_name:'TagRelationCount::getList',
						arg:{
							level_id:$scope.data.id,
							name:$scope.tag_name,
							// pageData:$scope.pageData,
						},
					}
					$.post("ajax.php",post_data,function(res){
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
					},"json")
				},500);
			}
			
			$scope.insert=function(){
				var search={
					name:$scope.tag_name,
					level_id:$scope.data.id,
				}
				var post_data={
					func_name:'TagRelationCount::insert',
					arg:search,
				}
				$.post("ajax.php",post_data,function(res){
					$scope.add_flag=true;
					$scope.getList();
					$scope.$apply();
				},"json");
			}
			$scope.delete=function(index){
				var search={
					id:$scope.list[index].id,
					level_id:$scope.data.id,
				}
				var post_data={
					func_name:'TagRelationCount::delete',
					arg:search,
				}
				$.post("ajax.php",post_data,function(res){
					$scope.list.splice(index,1);
					delete $scope.data.select_tid;
					$scope.add_flag=false;
					$scope.$apply();
				},"json");
			}
			
			
			$scope.$watch("data",$scope.getList,1)
			$scope.$watch("tag_name",function(value){
				if(!value)return;
				$scope.getList();
				$scope.add_flag=$scope.list.some(function(value){
					console.log($scope.tagName[value.id],$scope.tag_name);
					return $scope.tagName[value.id]==$scope.tag_name;
				})
			},1)
        },
    }
}]);