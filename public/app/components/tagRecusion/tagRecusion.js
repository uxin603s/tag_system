angular.module("app").component("tagRecusion",{
	bindings:{
		levelIndex:"=",
		select:"=",
		selectList:"=",
		childIds:"=",
		lock:"=",
	},
	templateUrl:'app/components/tagRecusion/tagRecusion.html?t='+Date.now(),
	controller:["$scope","cache","tagName","tagRelation","tagRelationCount",function($scope,cache,tagName,tagRelation,tagRelationCount){
		$scope.cache=cache;
		$scope.level_id=cache.levelList[$scope.$ctrl.levelIndex].id;		
		if($scope.$ctrl.levelIndex){
			$scope.p_level_id=cache.levelList[$scope.$ctrl.levelIndex-1].id;
		}
		
		$scope.search={tagName:''};
		
		var get_list=function(){
			$scope.watch_sort && $scope.watch_sort();
			var childIds=$scope.$ctrl.childIds;
			$scope.list=[];
			var count=cache.count[$scope.level_id];
			if(!count)return
			if(childIds){
				for(var i in childIds){
					if(count[i]){
						var item=count[i];
						item.sort_id=childIds[i].sort_id;
						$scope.list.push(item)
					}
				}
			}else{
				for(var i in count){
					if(count[i]){
						var item=count[i];
						$scope.list.push(item)
					}
				}
			}
			// console.log(count,childIds);
			$scope.list.sort(function(a,b){
				return a.sort_id-b.sort_id;
			})
			$scope.list.map(function(val,index){
				val.sort_id=index
			})
			if(!$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select){
				if($scope.list.length)
					if($scope.cache.levelList.length-1!=$scope.$ctrl.levelIndex){
						if(count[$scope.list[0].id].count){
							$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select=$scope.list[0].id;
						}
					}
			}
			$scope.watch_sort=$scope.$watch("list",function(curr,prev){
				if(!curr)return;
				if(!prev)return;
				
				for(var i in curr){
					if(curr[i])
					if(prev[i])
					if(curr[i].id!=prev[i].id){
						if($scope.$ctrl.levelIndex){
							tagRelation.ch({
								update:{
									sort_id:i
								},
								where:{
									id:$scope.$ctrl.select,
									level_id:$scope.p_level_id,
									child_id:curr[i].id,
								},
							})
							.then(function(i,res){
								curr[i].sort_id=i
								console.log(res);
							}.bind(this,i))
						}else{
							tagRelationCount.ch({
								update:{
									sort_id:i
								},
								where:{
									id:curr[i].id,
									level_id:$scope.level_id,
								},
							})
							.then(function(i,res){
								curr[i].sort_id=i
								console.log(res);
							}.bind(this,i))
						}
					}
					
				}
			
			},1)
		}
		var get_child=function(select){
			if(cache.relation[$scope.level_id][select]){
				$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].childIds=cache.relation[$scope.level_id][select];
			}else{
				$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].childIds={};
			}
		}
		
		var get_count=function(){
			promiseRecursive(function* (){
				var where_list=[]
				where_list.push({field:'level_id',type:0,value:$scope.level_id})
				var childIds=$scope.$ctrl.childIds;
				for(var i in childIds){
					where_list.push({field:'id',type:0,value:i})
				}
				var res=yield tagRelationCount.get(where_list);
				$scope.$apply();
			}())
		}
		
		var get_relation=function(select){
			promiseRecursive(function* (){
				var where_list=[]
				where_list.push({field:'level_id',type:0,value:$scope.level_id})
				where_list.push({field:'id',type:0,value:select})
				var res=yield tagRelation.get(where_list);
				
				$scope.$apply();
			}())
		}
		$scope.$watch("$ctrl.childIds",function(){
			get_count();
			get_list();
			if($scope.$ctrl.levelIndex){
				var select=$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select;
				var childIds=$scope.$ctrl.childIds;
				if(!childIds[select]){
					delete $scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select;
				}
			}
		},1);
		$scope.$watch("$ctrl.selectList["+$scope.$ctrl.levelIndex+"].select",function(select){
			get_relation(select);
			get_child(select)
		},1);
		$scope.$watch("cache.count["+$scope.level_id+"]",function(count){
			get_list();
		},1);
		get_list();
		
		$scope.add=function(){
			promiseRecursive(function* (){
				if(!$scope.search.tagName){
					yield Promise.reject("沒有設定標籤");
				}
				var list=yield tagName.nameToId($scope.search.tagName);
				var child_id=list[0].id;
				var count=0
				if($scope.$ctrl.levelIndex){
					if($scope.$ctrl.select==child_id){
						var message="不能跟父層同名"
						alert(message);
						yield Promise.reject(message);
					}else{	
						var add={
							level_id:$scope.p_level_id,
							id:$scope.$ctrl.select,
							child_id:child_id,
							sort_id:$scope.$ctrl.childIds?Object.keys($scope.$ctrl.childIds).length:0,
						}
						yield tagRelation.add(add);
					}
				}
				var add={
					level_id:$scope.level_id,
					id:child_id,
					count:0,
					sort_id:cache.count[$scope.level_id]?Object.keys(cache.count[$scope.level_id]).length:0,
				}
				yield tagRelationCount.add(add);
				
				$scope.search.tagName='';
				$scope.$apply();
			}())
		}
		$scope.del=function(index){
			promiseRecursive(function* (index){
				var child_id=$scope.list[index].id
				if($scope.$ctrl.levelIndex){//第一層沒有關聯;
					var relation_del={
						level_id:$scope.p_level_id,
						id:$scope.$ctrl.select,
						child_id:child_id,
					}
					yield tagRelation.del(relation_del);
				}
				var count_del={
					level_id:$scope.level_id,
					id:child_id,
				}
				var result=yield tagRelationCount.del(count_del)
				if(!result.status && $scope.$ctrl.levelIndex){
					yield tagRelation.add(relation_del);
				}
				$scope.$apply();
			}(index));
		}
	}]
});