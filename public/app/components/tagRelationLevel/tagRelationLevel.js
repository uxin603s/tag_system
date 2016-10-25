angular.module('app').component("tagRelationLevel",{
	bindings:{},
	templateUrl:'app/components/tagRelationLevel/tagRelationLevel.html?t='+Date.now(),
	controller:["$scope","cache",function($scope,cache){
		$scope.cache=cache;
		$scope.$watch("cache.selectTagType",function(value){
			if(typeof value!="undefined"){
				$scope.get();
			}
		},1)
		$scope.get=function(){
			var post_data={
				func_name:'TagRelationLevel::getList',
				arg:{
					tid:$scope.cache.selectTagType,
				},
			}
			$.post("ajax.php",post_data,function(res){
				cache.levelList=[]
				for(var i in res.list){
					cache.levelList.push({data:res.list[i],list:undefined,select:undefined})
				}
				$scope.$apply();
			},"json")
		}
		$scope.add=function(){
			var post_data={
				func_name:'TagRelationLevel::insert',
				arg:{
					tid:$scope.cache.selectTagType,
				},
			}
			$.post("ajax.php",post_data,function(res){
				$scope.get();
			},"json")
		}
		
	}]
});




