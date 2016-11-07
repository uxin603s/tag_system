angular.module('app').factory('tagRelation',['$rootScope','cache',function($rootScope,cache){
	var add=function(arg){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'TagRelation::insert',
				arg:arg,
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					var list=cache.levelList.find(function(val){
						return val.data.id==arg.level_id;
					}).list;
					
					if(list){
						var find_data=list.find(function(value){
							return value.id==arg.id
						})
						if(find_data){
							find_data.count++;
						}
					}
					resolve(arg);
				}else{
					reject("新增關聯失敗");
				}
				$rootScope.$apply();
			},"json")
		})
	}
	var del=function(arg){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'TagRelation::delete',
				arg:arg,
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					var list=cache.levelList.find(function(val){
						return val.data.id==arg.level_id;
					}).list;
					
					var index=list.findIndex(function(value){
						return value.id==arg.id
					})
					
					if(index!=-1){
						if(arg.auto_delete){
							list.splice(index,1)
						}else{
							list[index].count--;
						}
					}
					
					return resolve(arg);
				}else{
					return reject("刪除關聯失敗");
				}
				// $rootScope.$apply();
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
	return {
		add:add,
		del:del,
		get:get,
	}
}])