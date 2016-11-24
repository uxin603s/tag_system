angular.module('app').factory('webRelation',
["$rootScope","cache",function($rootScope,cache){
	var getInter=function(require_id,option_id,wid){
		return new Promise(function(resolve,reject){
			var post_data={
				func_name:'WebRelation::getIntersection',
				arg:{
					require_id:require_id,
					option_id:option_id,
					wid:wid,
				},
			}
			$.post("ajax.php",post_data,function(res){
				resolve(res);
				$rootScope.$apply();
			},"json");
		});
	}
	var get=function(where_list){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'WebRelation::getList',
				arg:{
					where_list:where_list,
				},
			}
			$.post("ajax.php",post_data,function(res){
				// console.log(res)
				if(res.status){
					getCount(res.list.map(function(val){
						return val.tid;
					}))
				}
				
				resolve(res)
				$rootScope.$apply();
			},"json")
		});
	}
	var add=function(arg){
		
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'WebRelation::insert',
				arg:arg,
			}
			$.post("ajax.php",post_data,function(res){
				resolve(res);
				
				$rootScope.$apply();
			},"json")
		})
	}
	var del=function(arg){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'WebRelation::delete',
				arg:arg,
			}
			$.post("ajax.php",post_data,function(res){
				resolve(res);
				$rootScope.$apply();
			},"json")
			
		});
	}
	
	var ch=function(arg){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'WebRelation::update',
				arg:arg,
			}
			$.post("ajax.php",post_data,function(res){
				resolve(res);
				$rootScope.$apply();
			},"json")
		});
	}
	
	var getCount=function(tid_arr){
		console.log("寫到這邊")
		return
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'WebRelation::getCount',
				arg:{
					tid_arr:tid_arr,
					wid:cache.webList.list[cache.webList.select].id,
				},
			}
			$.post("ajax.php",post_data,function(res){
				
				if(res.status){
					for(var i in res.list){
						cache.tagCount[i]=res.list[i]
					}
				}
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
		getInter:getInter,
		getCount:getCount,
	}
}])