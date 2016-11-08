angular.module('app').factory('tagRelation',['$rootScope','cache',function($rootScope,cache){
	var add=function(arg,list){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'TagRelation::insert',
				arg:arg,
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					var find_data=list.find(function(value){
						return value.id==arg.id
					})
					if(find_data){
						find_data.count++;
					}
					
					resolve(arg);
				}else{
					reject("新增關聯失敗");
				}
				$rootScope.$apply();
			},"json")
		})
	}
	var del=function(arg,list){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'TagRelation::delete',
				arg:arg,
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					
					
					var index=list.findIndex(function(value){
						return value.id==arg.id
					});
					
					if(index!=-1){
						list[index].count--;
						if(arg.auto_delete && list[index].count==0){
							list.splice(index,1)
						}
					}
					return resolve(res);
				}else{
					return reject("刪除關聯失敗");
				}
			},"json")
			
		});
	}
	var get=function(where_list){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'TagRelation::getList',
				arg:{
					where_list:where_list,
				},
			}
			$.post("ajax.php",post_data,function(res){
				resolve(res);
				$rootScope.$apply();
			},"json")
		});
	}
	var get_inter=function(require_id,option_id){
		return new Promise(function(resolve,reject){
			var post_data={
				func_name:'TagRelation::getIntersection',
				arg:{
					require_id:require_id,
					option_id:option_id,
				},
			}
			$.post("ajax.php",post_data,function(res){
				resolve(res);
				$rootScope.$apply();
			},"json");
		});
	}
	var ch=function(arg){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'TagRelation::update',
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
		get_inter:get_inter,
		ch:ch,
	}
}])