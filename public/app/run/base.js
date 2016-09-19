angular.module("app").run(['$rootScope','$filter',function($rootScope,$filter) {
	$rootScope.__proto__.user_config={}
	localforage.getItem(location.pathname+"user_config").then(function(data){
		if(data){
			$rootScope.__proto__.user_config=data;
		}
		$rootScope.$apply();
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
	$rootScope.__proto__.user_config.select_level || ($rootScope.__proto__.user_config.select_level=0);
	
	$rootScope.__proto__.user_config.select_page || ($rootScope.__proto__.user_config.select_page=0)
	$rootScope.__proto__.user_config.select_api_level || ($rootScope.__proto__.user_config.select_api_level=0)
	$rootScope.__proto__.page_list=[
		{name:'api列表',templateName:'api.html?t='+Date.now()},
		{name:'階層設定',templateName:'level.html?t='+Date.now()},
		// {name:'關聯設定',templateName:'relation.html?t='+Date.now()},
	];
	
	$rootScope.__proto__.sync_relation=function(data,index,type){
		console.log('sync_relation',data,index,type)
		var post_data={
			func_name:'TagRelation::sync',
			arg:{
				api_id:$rootScope.__proto__.user_config.select_api_level,
				level_id:data[index].id,
				id:data[index].select_tid,
				type:type,
			}
		}
		console.log(post_data.arg)
		$.post("ajax.php",post_data,function(res){
			console.log(res)
			if(type){
				if(data[index]){
					data[index].ggwp=1;
					$rootScope.__proto__.$apply();
					delete data[index].ggwp;
				}
			}else{
				// console.log($scope.list)
				if(data[index+1]){
					data[index+1].ggwp=1;
					$rootScope.__proto__.$apply();
					delete data[index+1].ggwp;
				}
			}
			$rootScope.__proto__.$apply();			
		},"json")
	}
}]);