angular.module('app').factory('level',[function(){
	var get=function(arg,callback){		
		var post_data={
			func_name:'TagLevel::getList',
			arg:arg,
		}
		$.post("ajax.php",post_data,callback,"json")
	}
	
	
	var add=function(arg,callback){
		var post_data={
			func_name:'TagLevel::insert',
			arg:arg,
		}
		$.post("ajax.php",post_data,callback,"json")
	}
	var del=function(arg,callback){
		var post_data={
			func_name:'TagLevel::delete',
			arg:arg,
		}
		$.post("ajax.php",post_data,callback,"json")
	}
	
	var update=function(arg,callback){
		var post_data={
			func_name:'TagLevel::update',
			arg:arg
		}
		$.post("ajax.php",post_data,callback,"json")
	}
	
	return {
		get:get,
		add:add,
		del:del,
		update:update,
	};
}])