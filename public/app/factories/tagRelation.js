angular.module('app').factory('tagRelation',['$rootScope','cache',function($rootScope,cache){
	var get=function(where_list){
		return new Promise(function(resolve,reject) {
			var level_id;
			var id;
			for(var i in where_list){
				var field=where_list[i].field
				var value=where_list[i].value
				if(field=="level_id"){
					level_id=value;
				}
				if(field=="id"){
					id=value;
				}
				
			}
			var relation=cache.relation[level_id];
			if(relation && Object.keys(relation).length){
				if(relation[id] && Object.keys(relation[id]).length){
					var list=[];
					for(var i in relation[id]){
						list.push(relation[id][i]);
					}
					// console.log("use cache")
					return resolve({status:true,list:list})
				}
			}
			
			var post_data={
				func_name:'TagRelation::getList',
				arg:{
					where_list:where_list,
				},
			}
			$.post("ajax.php",post_data,function(res){
				// console.log('需要快取',res)
				if(res.status){
					for(var i in res.list){
						var data=res.list[i];
						var id=data.id;
						var child_id=data.child_id;
						var level_id=data.level_id;
						cache.relation[level_id] || (cache.relation[level_id]={});
						cache.relation[level_id][id] || (cache.relation[level_id][id]={})
						cache.relation[level_id][id][child_id]=data;
					}
				}
				resolve(res)
			},"json")
		});
	}

	var add=function(arg){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'TagRelation::insert',
				arg:arg,
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					var data=res.insert;
					var level_id=data.level_id;
					var id=data.id;
					var child_id=data.child_id;
					
					if(cache.count[level_id][id])
						cache.count[level_id][id].count++;
					cache.relation[level_id] || (cache.relation[level_id]={});
					cache.relation[level_id][id] || (cache.relation[level_id][id]={})
					cache.relation[level_id][id][child_id]=data;
					resolve(data);
				}
				else{
					reject("新增relation失敗");
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
					var data=res.delete;
					var level_id=data.level_id;
					var id=data.id;
					var child_id=data.child_id;
					
					if(cache.count[level_id][id])
						cache.count[level_id][id].count--;
					
					delete cache.relation[level_id][id][child_id];
					resolve(data);
				}else{
					return reject("刪除關聯失敗");
				}
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