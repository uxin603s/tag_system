angular.module('app').factory('aliasList',[function(){
	var get=function(where_list){
		return new Promise(function(resolve,reject){
			var post_data={
				func_name:'AliasList::getList',
				arg:{
					where_list:where_list
				}
			}
			$.post("ajax.php",post_data,function(res){
				resolve && resolve(res);				
			},"json")
		})
	}

	
	var add=function(insert){
		return new Promise(function(resolve,reject){
			var post_data={
				func_name:'AliasList::insert',
				arg:insert,
			}
			$.post("ajax.php",post_data,function(res){
				resolve && resolve(res)
			},"json")
		})
	}
	return {
		add:add,
		get:get,
	}
}])