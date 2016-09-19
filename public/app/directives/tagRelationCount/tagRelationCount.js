angular.module("app").directive("tagRelationCount",['$parse','$timeout',function($parse,$timeout) {
    return {
		templateUrl: 'app/directives/tagRelationCount/tagRelationCount.html?t='+Date.now(),
		restrict: 'E',
		replace:true,
		scope:{
			tagName:'=',
			searchTagNameTmp:'=',
			data:'=',
			index:'=',
		},
        link: function($scope,$element,$attr) {
			$scope.getList=function(search){
				var time_name='getTagRelationCountList_timer';
				clearTimeout($scope[time_name]);
				$scope[time_name]=setTimeout(function(){
					var post_data={
						func_name:'TagRelationCount::getList',
						arg:search,
					}
					$.post("ajax.php",post_data,function(res){
						// console.log(res)
						$scope.list=[];
						if(res.status){
							$scope.list=res.list;
							for(var i in res.list){
								var id=res.list[i].id;
								$scope.searchTagNameTmp[id]=id;
							}
						}
						$scope.$apply();
					},"json")
				},500);
			}
			$scope.watch_getList=function(data){
				var search={};
				if($scope.data && $scope.data.id){
					search.level_id=$scope.data.id;
				}
				if($scope.tag_name){
					search.name=$scope.tag_name;
				}
				$scope.getList(search);
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
					$scope.watch_getList();
					$scope.$apply();
				},"json")
			}
			
			$scope.$watch("tag_name",$scope.watch_getList,1)
			$scope.$watch("data",$scope.watch_getList,1)
			
			$scope.$watch("tag_name",function(value){
				if(!value)return;
			
				$scope.add_flag=$scope.list.some(function(value){
					console.log($scope.tagName[value.id],$scope.tag_name);
					return $scope.tagName[value.id]==$scope.tag_name;
				})
			},1)
        },
    }
}]);