angular.module('app').component("idRelation",{
	bindings:{
		list:"=",
		sourceId:"=",
	},
	templateUrl:'app/components/idRelation/idRelation.html?t='+Date.now(),
	controller:["$scope","cache","tagName","aliasList","tagRelation",function($scope,cache,tagName,aliasList,tagRelation){
		$scope.cache=cache;
		$scope.add_relation=function(name){
			
			return promiseRecursive(function* (name){
				var source_id=$scope.$ctrl.sourceId;
				var level_id=$scope.cache.levelList[$scope.cache.levelList.length-1].id;
				var wid=$scope.cache.webList.list[$scope.cache.webList.select].id;
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
				add_relation_object.sort_id=$scope.cache.id_search.result[source_id].length
				
				
				
				var result=yield tagRelation.add(add_relation_object);
				
				$scope.cache.id_search.result[source_id].push(add_relation_object);
				
				$scope.cache.id_search.result[source_id].map(function(val,key){
					val.sort_id=key
				})
				$scope.cache.id_search.result[source_id].sort(function(a,b){
					return a.sort_id-b.sort_id;
				})
				yield tagName.idToName([result]);
				
				
				$scope.$apply();
			}(name));
		}


		$scope.del_relation=function(index){
			var source_id=$scope.$ctrl.sourceId;
			// if(!confirm("確認刪除關聯?"))return;
			var del=angular.copy($scope.cache.id_search.result[source_id][index]);
			del.auto_delete=1;
			
			
			tagRelation.del(del)
			.then(function(){
				$scope.cache.id_search.result[source_id].splice(index,1);
				$scope.$apply();
			})
		}

		$scope.$watch("$ctrl.list",function(curr,prev){
			if(!curr)return;
			if(!prev)return;
			
			clearTimeout($scope.result_timer)
			$scope.result_timer=setTimeout(function(){
				// console.log('sort',curr,prev)
				for(var i in curr){
					if(curr[i])
					if(prev[i])
					if(curr[i].id!=prev[i].id){
						// console.log('sort',curr)
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
								$scope.$apply();
							}
						}.bind(this,i));
					}
				}
			},0)				
		},1)
		
		
		var prevClickSearch;
		var watch_select=function(){
			clearTimeout($scope.clickSearch_timer)
			$scope.clickSearch_timer=setTimeout(function(){
				if(cache.id_search.select.indexOf($scope.$ctrl.sourceId)==-1)return;
				
				var currClickSearch=cache.clickSearch.filter(function(val){
					return !val.type;
				}).map(function(val){
					return val.name;
				});
				
				var list=cache.id_search.result[$scope.$ctrl.sourceId];
				for(var i in currClickSearch){
					promiseRecursive(function* (name){
						var index=list.findIndex(function(val){
							return $scope.cache.tagName[val.id]==name;
						})
						if(index==-1)
							yield $scope.add_relation(name);
						
					}(currClickSearch[i]))
				}
				// for(var i in prevClickSearch){
					// var name=prevClickSearch[i]
					// if(currClickSearch.indexOf(name)==-1){
						// var index=list.findIndex(function(val){
							// return $scope.cache.tagName[val.id]==name;
						// })
						// if(index!=-1)
							// $scope.del_relation(index);
					// }
				// }
				// prevClickSearch=currClickSearch;
				$scope.$apply();
			},0)
		}
		
		$scope.$watch("cache.id_search.select",watch_select,1)
		$scope.$watch("cache.clickSearch",watch_select,1)
	}],
})