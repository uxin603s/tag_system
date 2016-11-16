angular.module('app').component("tagRelationLevel",{
	bindings:{},
	templateUrl:'app/components/tagRelationLevel/tagRelationLevel.html?t='+Date.now(),
	controller:
	["$scope","cache","tagRelationCount","tagName","tagRelation","tagRecusion",
	function($scope,cache,tagRelationCount,tagName,tagRelation,tagRecusion){
		$scope.cache=cache;
		$scope.func=tagRecusion;
		cache.count || (cache.count={})
		cache.relation || (cache.relation={})
		cache.selectList || (cache.selectList=[]);
		cache.clickSearch || (cache.clickSearch=[])
		
		$scope.get=function(){
			var post_data={
				func_name:'TagRelationLevel::getList',
				arg:{
					tid:cache.tagType.list[cache.tagType.select].id,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					cache.levelList=res.list;
				}else{
					cache.levelList=[];
					cache.count={};
					cache.relation={};
				}
				$scope.$apply();
			},"json")
		}
		$scope.get();
		$scope.add=function(){
			var post_data={
				func_name:'TagRelationLevel::insert',
				arg:{
					tid:cache.tagType.list[cache.tagType.select].id,
					sort_id:cache.levelList.length || 0,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					cache.levelList.push(res.insert);
				}
				$scope.$apply();
			},"json")
		}
		$scope.del=function(index){
			if(!confirm("確認刪除?")){
				return;
			}
			var post_data={
				func_name:'TagRelationLevel::delete',
				arg:{
					id:cache.levelList[index].id,
					tid:cache.tagType.list[cache.tagType.select].id,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					cache.levelList.splice(index,1);
					$scope.$apply();
				}
			},"json")
		}
		
		var watch_select_list=function(){
			if(!cache.levelList)return;
			if(!cache.tagType.list)return;
			
			clearTimeout($scope.watch_select_list_timer);
			$scope.watch_select_list_timer=setTimeout(function(){
				
				var tree=[];
				for(var i in cache.levelList){
					tree.push({});
				}
				if(cache.tagType.list[cache.tagType.select].lock_lv1*1){
					
					promiseRecursive(function* (){
						
						var level_id=cache.levelList[0].id
						var res=yield tagRelationCount.get([
							{field:'level_id',type:0,value:level_id},
						]);
						var selectList=[];
						
						if(res.status){
							var list=res.list;
							for(var i in list){
								var select=list[i].id
								for(var j in tree){
									// console.log(j,select)
									tree[j].select=select;
									var where_list=[]
									where_list.push({field:'level_id',type:0,value:level_id})
									where_list.push({field:'id',type:0,value:select})
									var res=yield tagRelation.get(where_list);
									// console.log(res)
									cache.relation[level_id] || (cache.relation[level_id]={})
									cache.relation[level_id][select] || (cache.relation[level_id][select]={})
									if(res.status){
										tree[j].childIds=cache.relation[level_id][select];
									}else{
										tree[j].childIds={};
									}
									break;
								}
								selectList.push(angular.copy(tree));
							}
							
							cache.selectList.splice(0,cache.selectList.length)
							
							for(var i in selectList){
								cache.selectList.push(selectList[i]);
							}
							
							yield tagName.idToName(list.map(function(val){return val.id}));
							$scope.$apply();
						}
					}())
				}else{
					
					var selectList=[];
					selectList.push(angular.copy(tree));
					cache.selectList.splice(0,cache.selectList.length)
					for(var i in selectList){
						cache.selectList.push(selectList[i]);
					}
					$scope.$apply();
				}
			},0)
		}
		
		$scope.$watch("cache.levelList",watch_select_list,1)
		$scope.$watch("cache.tagType.list",watch_select_list,1)
		
	}]
});