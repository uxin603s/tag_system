angular.module("app").directive("pagnation",['$parse','$timeout',function($parse,$timeout) {
    return {
		templateUrl: 'app/directives/pagnation/pagnation.html?t='+Date.now(),
		restrict: 'E',
		replace:true,
		scope:{
			data:'=',
			callback:'=',
			callbackarg:'=',
		},
        link: function($scope,$element,$attr) {
			$scope.$watch('data',function(newV,oldV){
				if(!newV)return;
				if(!$scope.data.limit_count*1)$scope.data.limit_count=1;
				$scope.page_count=Math.ceil($scope.data.total_count/$scope.data.limit_count);
				$scope.page_arr=[];
				for(var i=0;i<$scope.page_count;i++){
					$scope.page_arr.push(i);
				}
				$scope.page_start=$scope.data.limit_page-3;				
				$scope.page_end=$scope.data.limit_page+3;
				if($scope.page_start < 0){
					$scope.page_end-=$scope.page_start;
				}
				if($scope.page_end > $scope.page_count){
					$scope.page_start-=$scope.page_end-$scope.page_count;
				}
			},1)
			$scope.$watch('data.limit_page',$scope.callback);
			$scope.$watch('data.limit_count',function(value){
				if(!value)return;
				$scope.data.limit_page=0;
				$scope.callback && $scope.callback($scope.callbackarg);
			});
        },
    }
}]);