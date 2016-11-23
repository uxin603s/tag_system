angular.module('app').factory('webRelation',["$rootScope",function($rootScope){
	var getInter=function(require_id,option_id,wid){
		return new Promise(function(resolve,reject){
			var post_data={
				func_name:'WebRelation::getIntersection',
				arg:{
					require_id:require_id,
					option_id:option_id,
					wid:wid,
				},
			}
			$.post("ajax.php",post_data,function(res){
				resolve(res);
				$rootScope.$apply();
			},"json");
		});
	}
	var get=function(where_list){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'WebRelation::getList',
				arg:{
					where_list:where_list,
				},
			}
			$.post("ajax.php",post_data,function(res){
				resolve(res)
				$rootScope.$apply();
			},"json")
		});
	}

	var add=function(arg){
		
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'WebRelation::insert',
				arg:arg,
			}
			$.post("ajax.php",post_data,function(res){
				resolve(res);
				
				$rootScope.$apply();
			},"json")
		})
	}
	var del=function(arg){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'WebRelation::delete',
				arg:arg,
			}
			$.post("ajax.php",post_data,function(res){
				resolve(res);
				$rootScope.$apply();
			},"json")
			
		});
	}
	
	var ch=function(arg){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'WebRelation::update',
				arg:arg,
			}
			$.post("ajax.php",post_data,function(res){
				resolve(res);
				$rootScope.$apply();
			},"json")
		});
	}
	
	return {
		add:add,
		del:del,
		get:get,
		ch:ch,
		getInter:getInter,
	}
}])