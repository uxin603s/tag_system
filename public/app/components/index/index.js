angular.module('app').component("index",{
	bindings:{},
	templateUrl:'app/components/index/index.html',
	controller:['$scope','cache',function($scope,cache){
		$scope.cache=cache;
	}],
})

