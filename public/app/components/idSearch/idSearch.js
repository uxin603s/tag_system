angular.module('app').component("idSearch",{
	bindings:{},
	templateUrl:'app/components/idSearch/idSearch.html?t='+Date.now(),
	controller:["$scope","cache","tagName","aliasList","tagRelation",function($scope,cache,tagName,aliasList,tagRelation){
		$scope.cache=cache;
		$scope.cache.id_search || ($scope.cache.id_search={});
		$scope.cache.id_search.search || ($scope.cache.id_search.search=[]);
		$scope.cache.id_search.select || ($scope.cache.id_search.select=[]);
		$scope.cache.id_search.result || ($scope.cache.id_search.result={});
		
		var get_id_relation_tag=function(source_id,callback){
			return new Promise(function(resolve,reject){
				promiseRecursive(function* (){
					var where_list=[
						{field:'wid',type:0,value:$scope.cache.webList.list[$scope.cache.webList.select].id},
						{field:'source_id',type:0,value:source_id},
					];
					var res=yield aliasList.get(where_list)//把source_id轉換成id
					if(res.status){
						var item=res.list.pop();
						
						var where_list=[
							{field:'level_id',type:0,value:$scope.cache.levelList[$scope.cache.levelList.length-1].id},
							{field:'child_id',type:0,value:item.id},
						];
						tagRelation.get(where_list).then(resolve);
						
					}
					else{
						resolve();
						// yield Promise.reject("alias_list不存在");
					}
				}());
			})
		}
		var id_search_tag=function(){
			clearTimeout($scope.id_search_tag_timer)
			$scope.id_search_tag_timer=setTimeout(function(){
				var ids=$scope.cache.id_search.search;
				
				for(var i in ids){
					var id=ids[i];
					
					get_id_relation_tag(ids[i])
					.then(function(id,res){
						if(res.status){
							$scope.cache.id_search.result[id]=res.list;
							if(Object.keys($scope.cache.id_search.result).length==ids.length){
								$scope.$apply();
							}
							// console.log(res.list)
							return res.list.map(function(val){
								return val.id;
							})
						}else{
							$scope.cache.id_search.result[id]=[];
							$scope.$apply();
						}
						
					}.bind(this,id))
					.then(tagName.idToName)
					.catch(function(message){
						// console.log(message)
					})
				}
			},0);
		}
		$scope.$watch("cache.id_search.search",function(value){
			if(!value)return;
			id_search_tag();
		},1)
		$scope.add_id_search=function(id){
			if($scope.cache.id_search.search.indexOf(id)==-1){
				$scope.cache.id_search.search.push(id)
			}
		}
		$scope.del_id_search=function(index){
			var source_id=$scope.cache.id_search.search.splice(index,1).pop();
			delete $scope.cache.id_search.result[source_id];
		}
		$scope.select_id_search=function(item){
			var index=cache.id_search.select.indexOf(item);
			if(index==-1){
				cache.id_search.select.push(item)
			}else{
				cache.id_search.select.splice(index,1)
			}
		}

		
	}],
})