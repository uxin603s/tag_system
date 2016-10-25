angular.module('app').factory('cache',['$rootScope',function($rootScope){
	var cache={};
	localforage.getItem(location.pathname+"cache").then(function(data){
		for(var i in data){
			cache[i]=data[i];
		}
		$rootScope.$apply();
		setInterval(function(){
			localforage.setItem(location.pathname+"cache",angular.copy(cache));
		},500)
	});
	return cache;
}])