angular.module("app").component("tagRecusion",{
	bindings:{
		levelIndex:"=",
		select:"=",
		selectList:"=",
		childIds:"=",
		lock:"=",
		func:"=",
	},
	templateUrl:'app/components/tagRecusion/tagRecusion.html?t='+Date.now(),
	controller:["$scope","cache",function($scope,cache){
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
						$scope.list.push(count[i])
					}
				}
				$scope.list.sort(function(a,b){
					return childIds[a.id].sort_id-childIds[b.id].sort_id;
				})
				$scope.list.map(function(val,index){
					childIds[val.id].sort_id=index;
				})
			}else{
				for(var i in count){
					if(count[i]){
						var item=count[i];
						$scope.list.push(item)
					}
				}
				$scope.list.sort(function(a,b){
					return a.sort_id-b.sort_id;
				})
				$scope.list.map(function(val,index){
					val.sort_id=index
				})
				
			}
			if($scope.$ctrl.func){
				var sort=$scope.$ctrl.func.sort.bind(this,$scope.$ctrl.levelIndex,$scope.$ctrl.select)
				$scope.watch_sort=$scope.$watch("list",sort,1)
			}
			
			if(!$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select){
				if($scope.list.length)
					if($scope.cache.levelList.length-1!=$scope.$ctrl.levelIndex){
						if(count[$scope.list[0].id].count){
							$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select=$scope.list[0].id;
						}
					}
			}
			
		}
		var get_child=function(select){
			if(cache.relation[$scope.level_id])
			if(cache.relation[$scope.level_id][select]){
				$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].childIds=cache.relation[$scope.level_id][select];
			}else{
				$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].childIds={};
			}
		}
		
		
		$scope.$watch("$ctrl.childIds",function(){
			get_list();
			if($scope.$ctrl.levelIndex){
				var select=$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select;
				var childIds=$scope.$ctrl.childIds;
				if(!childIds[select]){
					delete $scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select;
				}
			}
			if($scope.$ctrl.func)
				$scope.$ctrl.func.get_count($scope.$ctrl.levelIndex,$scope.$ctrl.childIds);
		},1);
		$scope.$watch("$ctrl.selectList["+$scope.$ctrl.levelIndex+"].select",function(select){
			if($scope.$ctrl.func)
				$scope.$ctrl.func.get_relation($scope.$ctrl.levelIndex,select);
			
			get_child($scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select)
		},1);
		
		$scope.$watch("cache.count["+$scope.level_id+"]",function(count){
			get_list();
		},1);
		$scope.$watch("cache.relation["+$scope.level_id+"]",function(){
			get_child($scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select)
		},1);
		
	}]
});