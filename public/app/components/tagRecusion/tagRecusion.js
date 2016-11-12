angular.module("app").component("tagRecusion",{
	bindings:{
		levelIndex:"=",
		select:"=",
		childIds:"=",
	},
	templateUrl:'app/components/tagRecusion/tagRecusion.html?t='+Date.now(),
	controller:["$scope","cache","tagName","tagRelation","tagRelationCount",function($scope,cache,tagName,tagRelation,tagRelationCount){
		$scope.cache=cache;
		$scope.level_id=cache.levelList[$scope.$ctrl.levelIndex].id
		$scope.search={tagName:''};
		
		var watch_sort=function (){
			$scope.watch_list=$scope.$watch("list",function(curr,prev){
				if(!curr)return;
				if(!prev)return;
				
				for(var i in curr){
					if(curr[i])
					if(prev[i])
					if(curr[i].id!=prev[i].id){
						if($scope.$ctrl.levelIndex){
							var id=$scope.$ctrl.select[$scope.$ctrl.levelIndex-1];
							tagRelation.ch({
								update:{
									sort_id:i
								},
								where:{
									id:id,
									level_id:$scope.cache.levelList[$scope.$ctrl.levelIndex-1].id,
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
		
		$scope.get=function(){
			$scope.watch_list && $scope.watch_list();
			promiseRecursive(function* (){
				var where_list=[]
				where_list.push({field:'level_id',type:0,value:$scope.level_id})
				var childIds=$scope.$ctrl.childIds;
				for(var i in childIds){
					where_list.push({field:'id',type:0,value:i})
				}
				var res=yield tagRelationCount.get(where_list);
				
				
				$scope.list=[];
				
				var count=cache.count[$scope.level_id];
				
				if(childIds){
					for(var i in childIds){
						var item=angular.copy(count[i]);
						item.sort_id=childIds[i].sort_id;
						$scope.list.push(item)
					}
				}else{
					for(var i in count){
						var item=angular.copy(count[i]);
						$scope.list.push(item)
					}
				}
				
				$scope.list.sort(function(a,b){
					return a.sort_id-b.sort_id;
				})
				$scope.list.map(function(val,index){
					val.sort_id=index
				})
				watch_sort();
				$scope.$apply();
			}())
			.catch(function(message){
				console.log(message)
				$scope.$apply()
			})
		}
		$scope.$watch("$ctrl.select["+($scope.$ctrl.levelIndex)+"]",function(select){
			if(!select)return;
			promiseRecursive(function* (){
				var where_list=[]
				where_list.push({field:'level_id',type:0,value:$scope.level_id})
				where_list.push({field:'id',type:0,value:select})
				var res=yield tagRelation.get(where_list);
				$scope.childIds=cache.relation[$scope.level_id][select];
				$scope.$apply();
			}())
		},1)
		if($scope.$ctrl.levelIndex){
			$scope.$watch("$ctrl.childIds",function(){
				$scope.get();
			},1)
		}else{
			$scope.get();
		}
		// $scope.$watch("search.tagName",function(){
			// clearTimeout($scope.searchTagNameTimer);
			// $scope.searchTagNameTimer=setTimeout(function(){
				// $scope.list=$scope.list.filter(function(val){
					// val
				// })
				// $scope.$apply();
			// },500)
		// },1)
		
			
		
		
		
	}]
});