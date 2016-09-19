angular.module("app").directive("tagRelationCount",['$parse','$timeout',function($parse,$timeout) {
    return {
		templateUrl: 'app/directives/tagRelationCount/tagRelationCount.html?t='+Date.now(),
		restrict: 'E',
		replace:true,
		scope:{
			tagName:'=',
			searchTagNameTmp:'=',
			data:'=',
			levelList:'=',
			index:'=',
		},
        link: function($scope,$element,$attr) {
			$scope.getList=function(search,delay_time){
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
				},delay_time);
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
					$scope.add_flag=true;
					$scope.watch_getList();
					$scope.$apply();
					
					if($scope.levelList[$scope.index-1].sync_relation*1){
						$scope.sync_relation($scope.levelList,$scope.index-1,1);
					}
				},"json");
			}
			$scope.delete=function(index){
				// console.log($scope.data)
				var search={
					id:$scope.list[index].id,
					level_id:$scope.data.id,
				}
				var post_data={
					func_name:'TagRelationCount::delete',
					arg:search,
				}
				// console.log(post_data)
				// return
				$.post("ajax.php",post_data,function(res){
					console.log(res)
					$scope.list.splice(index,1);
					delete $scope.data.select_tid;
					$scope.add_flag=false;
					$scope.$apply();
				},"json");
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