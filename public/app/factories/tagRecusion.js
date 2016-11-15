angular.module('app').factory('tagRecusion',
['$rootScope','cache','tagRelation','tagRelationCount','tagName',
function($rootScope,cache,tagRelation,tagRelationCount,tagName){
	var get_count=function(levelIndex,childIds){
		promiseRecursive(function* (){
			var where_list=[]
			where_list.push({field:'level_id',type:0,value:cache.levelList[levelIndex].id})
			for(var i in childIds){
				where_list.push({field:'id',type:0,value:i})
			}
			var res=yield tagRelationCount.get(where_list);
			$rootScope.$apply();
		}())
	}
	var get_relation=function(levelIndex,select,callback){
		promiseRecursive(function* (){
			var where_list=[]
			where_list.push({field:'level_id',type:0,value:cache.levelList[levelIndex].id})
			where_list.push({field:'id',type:0,value:select})
			var res=yield tagRelation.get(where_list);
			callback && callback()
			$rootScope.$apply();
		}())
	}
	var add=function(levelIndex,select,search,childIds){
		promiseRecursive(function* (){
			var level_id=cache.levelList[levelIndex].id
			if(!search.tagName){
				yield Promise.reject("沒有設定標籤");
			}
			var list=yield tagName.nameToId(search.tagName);
			var child_id=list[0].id;
			var count=0
			if(levelIndex){
				if(select==child_id){
					var message="不能跟父層同名"
					alert(message);
					yield Promise.reject(message);
				}else{	
					var add={
						level_id:cache.levelList[levelIndex-1].id,
						id:select,
						child_id:child_id,
						sort_id:childIds?Object.keys(childIds).length:0,
					}
					yield tagRelation.add(add);
				}
			}
			var add={
				level_id:level_id,
				id:child_id,
				count:0,
				sort_id:cache.count[level_id]?Object.keys(cache.count[level_id]).length:0,
			}
			yield tagRelationCount.add(add);
			
			search.tagName='';
			$rootScope.$apply();
		}())
	}
	var del=function(levelIndex,select,child_id){
		promiseRecursive(function* (){
			// var child_id=$rootScope.list[index].id
			if(levelIndex){//第一層沒有關聯;
				var relation_del={
					level_id:cache.levelList[levelIndex-1].id,
					id:select,
					child_id:child_id,
				}
				yield tagRelation.del(relation_del);
			}
			var count_del={
				level_id:cache.levelList[levelIndex].id,
				id:child_id,
			}
			var result=yield tagRelationCount.del(count_del)
			if(!result.status && $rootScope.$ctrl.levelIndex){
				yield tagRelation.add(relation_del);
			}
			$rootScope.$apply();
		}());
	}
	var sort=function(levelIndex,select,curr,prev){
		if(!curr)return;
		if(!prev)return;
		
		for(var i in curr){
			if(curr[i])
			if(prev[i])
			if(curr[i].id!=prev[i].id){
				if(levelIndex){
					var curr_item=cache.relation[cache.levelList[levelIndex-1].id][select][curr[i].id];
					curr_item.sort_id=i
					tagRelation.ch({
						update:{
							sort_id:i
						},
						where:{
							id:select,
							level_id:cache.levelList[levelIndex-1].id,
							child_id:curr[i].id,
						},
					})
					.then(function(res){
						
						console.log(res);
					})
				}else{
					curr[i].sort_id=i;
					tagRelationCount.ch({
						update:{
							sort_id:i
						},
						where:{
							id:curr[i].id,
							level_id:cache.levelList[levelIndex].id,
						},
					})
					.then(function(res){
						console.log(res);
					})
				}
			}
			
		}
	
	}

	return {
		add:add,
		del:del,
		get_count:get_count,
		get_relation:get_relation,
		sort:sort
	}
}])