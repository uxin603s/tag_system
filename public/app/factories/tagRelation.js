angular.module('app').factory('tagRelation',[function(){
	var add=function(arg){
		return new Promise(function(resolve) {
			var post_data={
				func_name:'TagRelation::insert',
				arg:arg,
			}
			$.post("ajax.php",post_data,resolve,"json")
		})
	}
	var del=function(arg){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'TagRelation::delete',
				arg:arg,
			}
			$.post("ajax.php",post_data,resolve,"json")
			
		});
	}
	var get=function(where_list,callback){
		var post_data={
			func_name:'TagRelation::getList',
			arg:{
				where_list:where_list,
			},
		}
		$.post("ajax.php",post_data,callback,"json")
	}
	return {
		add:add,
		del:del,
		get:get,
	}
}])