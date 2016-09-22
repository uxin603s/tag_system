angular.module("app").run(['$rootScope','$filter',function($rootScope,$filter) {
	$rootScope.__proto__.user_config={}
	localforage.getItem(location.pathname+"user_config").then(function(data){
		if(data){
			$rootScope.__proto__.user_config=data;
		}
		$rootScope.$apply();
		// localforage.setItem(location.pathname+"user_config",{});
		setInterval(function(){
			localforage.setItem(location.pathname+"user_config",angular.copy($rootScope.__proto__.user_config));
			$rootScope.$apply();
		},500)
	});
	
	$rootScope.__proto__.confirm=function(message){
		return $rootScope.__proto__.user_config.confirm_sw || confirm(message);			
	};
	$rootScope.__proto__.alert=function(message){
		window.alert(message);
	};
	
	$rootScope.__proto__.Math=window.Math;
	$rootScope.__proto__.isNaN=window.isNaN;
	
	$rootScope.$watch("user_config",function(user_config){
		if(!user_config)return;
		user_config.select_page || (user_config.select_page=0);
		user_config.tailData || (user_config.tailData={});
		if(isNaN(user_config.select_api_id)){
			user_config.select_page=0
		}
	},1)
	
	$rootScope.__proto__.page_list=[
		{name:'標籤列表',templateName:'list.html?t='+Date.now()},
		{name:'階層設定',templateName:'level.html?t='+Date.now()},
		// {name:'關聯設定',templateName:'relation.html?t='+Date.now()},
	];
	
	
}]);