angular.module('app').component("index",{
	bindings:{},
	templateUrl:'app/components/index/index.html?t='+Date.now(),
	controller:['$scope','cache',function($scope,cache){
		$scope.cache=cache;
		$scope.cache.mode || ($scope.cache.mode={
			list:[
				{select:1,name:'階層編輯'},
				{select:2,name:'標籤搜尋'},
				{select:3,name:'關聯編輯'},
			],
			select:undefined,
		})
		// $scope.$watch("cache.mode.select",function(select){
			// if(isNaN(select))return
			// console.log(select)
		// })
		$scope.cache.mode.width=window.innerWidth
		$scope.cache.mode.height=window.innerHeight;
		window.onresize = function(e) {
			$scope.cache.mode.width=window.innerWidth
			$scope.cache.mode.height=window.innerHeight;
			$scope.$apply();
			// console.log(e,window.innerWidth,window.innerHeight)
		};
	}],
})

