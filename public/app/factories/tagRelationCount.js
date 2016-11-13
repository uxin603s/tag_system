angular.module('app').factory('tagRelationCount',['$rootScope','cache','tagName',function($rootScope,cache,tagName){
	var get=function(where_list){
		return new Promise(function(resolve,reject) {	
			var post_data={
				func_name:'TagRelationCount::getList',
				arg:{
					where_list:where_list,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					var ids=[];
					for(var i in res.list){
						var data=res.list[i];
						var level_id=data.level_id;
						var id=data.id;
						ids.push(id);
						cache.count[level_id] || (cache.count[level_id]={});
						cache.count[level_id][id]=data;
					}
					tagName.idToName(ids);
					$rootScope.$apply();
				}
				resolve(res)
			},"json")
		})
	}
	var add=function(arg){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'TagRelationCount::insert',
				arg:arg,
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					var data=res.insert;
					var level_id=data.level_id;
					var id=data.id;
					cache.count[level_id] || (cache.count[level_id]={});
					cache.count[level_id][id]=data;
					tagName.idToName([id]);
					resolve(data);
				}else{
					reject("新增count失敗");
				}
				$rootScope.$apply();
			},"json")
		})
	}
	var del=function(arg){
		return new Promise(function(resolve,reject){
			var post_data={
				func_name:'TagRelationCount::delete',
				arg:arg,
			}
			
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					
					delete cache.count[arg.level_id][arg.id];
					$rootScope.$apply();
				}
				resolve(res);
			},"json")
		})
	}
	
	var ch=function(arg){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'TagRelationCount::update',
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
	}
}])