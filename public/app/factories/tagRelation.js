angular.module('app').factory('tagRelation',['$rootScope','cache',function($rootScope,cache){
	cache.tagRelationList || (cache.tagRelationList={})
	var add=function(arg,list){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'TagRelation::insert',
				arg:arg,
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
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
	var del=function(arg,list){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'TagRelation::delete',
				arg:arg,
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					if(list){
						var index=list.findIndex(function(value){
							return value.id==arg.id
						});
						
						if(index!=-1){
							list[index].count--;
							if(arg.auto_delete && list[index].count==0){
								list.splice(index,1)
							}
						}
					}
					return resolve(res);
				}else{
					return reject("刪除關聯失敗");
				}
			},"json")
			
		});
	}
	var get=function(where_list,use_cache){
		// console.log(where_list)
		
		return new Promise(function(resolve,reject) {
			if(!use_cache){
				// console.log('使用了快取');
				var result=[];
				var id=[];
				var list=undefined;
				for(var i in where_list){
					var data=where_list[i];
					var field=data.field;
					var value=data.value;
					
					if(field=='level_id'){
						// console.log(value,cache.tagRelationList)
						if(cache.tagRelationList[value])
							list=angular.copy(cache.tagRelationList[value]);
					}else if(field=='id'){
						id.push(value)
					}
				}
				if(list){
					if(id.length){
						for(var i in id){
							for(var j in list[id[i]]){
								result.push(list[id[i]][j])
							}
						}
					}else{
						for(var i in list){
							for(var j in list[i]){
								result.push(list[i][j])
							}
						}
					}
					if(result.length){
						var result={status:true,list:result}
						// console.log(result)
						return resolve(result);
					}
				}
			}
			// console.log('qq',id,list,result)
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
						
						// console.log(level_id,id,child_id,data)
						
						cache.tagRelationList[level_id] || (cache.tagRelationList[level_id]={});
						cache.tagRelationList[level_id][id] || (cache.tagRelationList[level_id][id]={});
						cache.tagRelationList[level_id][id][child_id] || (cache.tagRelationList[level_id][id][child_id]={});
						// console.log(cache.tagRelationList[level_id][id][child_id])
						cache.tagRelationList[level_id][id][child_id]=angular.copy(data);
						// console.log(data)
					}
				}
				
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