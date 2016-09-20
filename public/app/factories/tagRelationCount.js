angular.module('app').factory('tagRelationCount',[function(){
	
	var get=function(arg,callback){
		var post_data={
			func_name:'TagRelationCount::getList',
			arg:arg
		}
		$.post("ajax.php",post_data,callback,"json")
	}
	
	var add=function(arg,callback){
		var post_data={
			func_name:'TagRelationCount::insert',
			arg:arg,
		}
		$.post("ajax.php",post_data,callback,"json");
	}
	var del=function(arg,callback){
		var post_data={
			func_name:'TagRelationCount::delete',
			arg:arg,
		}
		$.post("ajax.php",post_data,callback,"json");
	}

	return {
		get:get,
		add:add,
		del:del,
	};
}])