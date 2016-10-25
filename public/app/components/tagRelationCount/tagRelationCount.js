angular.module("app").component("tagRelationCount",{
	bindings:{
		levelIndex:"=",
	},
	templateUrl:'app/components/tagRelationCount/tagRelationCount.html?t='+Date.now(),
	controller:["$scope","cache",function($scope,cache){
		
		$scope.cache=cache;
		
		$scope.$watch("cache.levelList",function(value){
			if(value && value[$scope.$ctrl.levelIndex]){
				$scope.level_id=value[$scope.$ctrl.levelIndex].data.id;
				$scope.get();
			}else{
				$scope.list=[];
			}
		},1);
		
		
		
		
		// $scope.$watch("select",function(select){
			// level_data.select=select;
			// console.log(level_data)
		// },1);
		
		$scope.get=function(){
			var post_data={
				func_name:'TagRelationCount::getList',
				arg:{
					level_id:$scope.level_id,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					$scope.list=res.list;
				}
				$scope.$apply();
			},"json")
		}
		$scope.add=function(name){
			var post_data={
				func_name:'TagRelationCount::insert',
				arg:{
					level_id:$scope.level_id,
					name:name,
				},
			}
			$.post("ajax.php",post_data,function(res){
				$scope.list.push(res.insert)
				$scope.$apply();
			},"json")
		}
	}]
})
