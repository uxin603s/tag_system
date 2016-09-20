angular.module('app').factory('tagRelation',[function(){
	var get=function(arg,callback){
		var post_data={
			func_name:'TagRelation::getList',
			arg:arg,
		}
		$.post("ajax.php",post_data,callback,"json")
	}

	var add=function(arg,callback){//count§ó·s
		var post_data={
			func_name:'TagRelation::insert',
			arg:arg,
		}
		$.post("ajax.php",post_data,callback,"json")
	}
	var del=function(arg,callback){
		var post_data={
			func_name:'TagRelation::delete',
			arg:arg,
		}
		$.post("ajax.php",post_data,callback,"json")
	}

	return {
		get:get,
		add:add,
		del:del,
	};
}])