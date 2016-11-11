angular.module('app').factory('tagRelationCount',['$rootScope','cache',function($rootScope,cache){
	cache.tagRelationCountList || (cache.tagRelationCountList={})
	var add=function(arg,list){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'TagRelationCount::insert',
				arg:arg,
			}
			$.post("ajax.php",post_data,function(res){
				
				if(list){
					list.push(res);
				}
				cache.tagRelationCountList[arg.level_id][arg.id]=res;
				$rootScope.$apply();
				
				resolve();
			},"json")
		})
	}
	var del=function(arg,list){
		return new Promise(function(resolve,reject){
			var post_data={
				func_name:'TagRelationCount::delete',
				arg:arg,
			}
			
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					var index=list.findIndex(function(val){
						return arg.id==val.id;
					})
					
					if(index!=-1){
						list.splice(index,1);
					}
					delete cache.tagRelationCountList[arg.level_id][arg.id];
					$rootScope.$apply();
				}
				resolve(res);
			},"json")
		})
	}
	var get=function(where_list,use_cache){
		return new Promise(function(resolve,reject) {
			// cache.tagRelationCountList={};
			if(use_cache){
				console.log('使用了快取');
				var result=[];
				var id=[];
				var list=undefined;
				for(var i in where_list){
					var data=where_list[i];
					var field=data.field;
					var value=data.value;
					if(field=='level_id'){
						if(cache.tagRelationCountList[value])
							list=angular.copy(cache.tagRelationCountList[value]);
					}else if(field=='id'){
						id.push(value)
					}
				}
				if(list){
					for(var i in id){
						result.push(list[id[i]])
					}
					
					if(!id.length){
						for(var i in list){
							result.push(list[i])
						}
					}
					if(result.length){
						var result={status:true,list:result}
						return resolve(result);
					}
				}
			}
			
			var post_data={
				func_name:'TagRelationCount::getList',
				arg:{
					where_list:where_list,
				},
			}
			$.post("ajax.php",post_data,function(res){
				// console.log('需要快取')
				for(var i in res.list){
					var data=res.list[i];
					var level_id=data.level_id;
					var id=data.id;
					cache.tagRelationCountList[level_id] || (cache.tagRelationCountList[level_id]={});
					cache.tagRelationCountList[level_id][id]=angular.copy(data);
				}
				
				resolve(res);
				$rootScope.$apply();
			},"json")
			
		});
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