angular.module('app').factory('idRelation',
["$rootScope","cache","tagName","aliasList","tagRelation",
function($rootScope,cache,tagName,aliasList,tagRelation){
	var add=function(name,source_id){
		return promiseRecursive(function* (){
			var level_id=cache.levelList[cache.levelList.length-1].id;
			var wid=cache.webList.list[cache.webList.select].id;
			var add_relation_object={
				level_id:level_id,
			};
			
			var list=yield tagName.nameToId(name);
			
			add_relation_object.id=list.pop().id;
			
			var where_list=[
				{field:'wid',type:0,value:wid},
				{field:'source_id',type:0,value:source_id},
			];				
			var res=yield aliasList.get(where_list); //把source_id轉換成id
			if(res.status){
				var item=res.list.pop();
			}else{
				var item=yield aliasList.add({
					wid:wid,
					source_id:source_id,
				});
			}
			add_relation_object.child_id=item.id;
			add_relation_object.sort_id=cache.id_search.result[source_id].length
			
			
			
			var result=yield tagRelation.add(add_relation_object);
			
			cache.id_search.result[source_id].push(add_relation_object);
			
			cache.id_search.result[source_id].map(function(val,key){
				val.sort_id=key
			})
			cache.id_search.result[source_id].sort(function(a,b){
				return a.sort_id-b.sort_id;
			})
			yield tagName.idToName([result]);
			
			
			$rootScope.$apply();
		}());
	}
	var del=function(index,source_id){
		// if(!confirm("確認刪除關聯?"))return;
		var del=angular.copy(cache.id_search.result[source_id][index]);
		del.auto_delete=1;
		tagRelation.del(del)
		.then(function(){
			cache.id_search.result[source_id].splice(index,1);
			$rootScope.$apply();
		})
	}
	var ch=function(curr,prev){
		if(!curr)return;
		if(!prev)return;
		
		for(var i in curr){
			if(curr[i])
			if(prev[i])
			if(curr[i].id!=prev[i].id){
				var id=curr[i].id;
				var level_id=curr[i].level_id;
				var child_id=curr[i].child_id
				var sort_id=i;
				tagRelation.ch({
					update:{
						sort_id:sort_id
					},
					where:{
						id:id,
						level_id:level_id,
						child_id:child_id,
					},
				})
				.then(function(i,res){
					console.log(res)
					if(res.status){
						curr[i].sort_id=i;
						$rootScope.$apply();
					}
				}.bind(this,i));
			}
		}
	}
	return {
		add:add,
		del:del,
		ch:ch,
	}
}])