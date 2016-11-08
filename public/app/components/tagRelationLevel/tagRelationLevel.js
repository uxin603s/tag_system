angular.module('app').component("tagRelationLevel",{
	bindings:{},
	templateUrl:'app/components/tagRelationLevel/tagRelationLevel.html?t='+Date.now(),
	controller:["$scope","cache",function($scope,cache){
		$scope.cache=cache;
		$scope.$watch("cache.tagType.select",function(value){
			if(!value)return;
			$scope.get();
		},1);
		
		$scope.get=function(){
			var post_data={
				func_name:'TagRelationLevel::getList',
				arg:{
					tid:$scope.cache.tagType.select,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					cache.levelList=res.list;
					cache.treeData=[];
					if(cache.levelList.length>2){
						
					}else{
						var tree=[];
						for(var i in cache.levelList){
							tree.push({list:[],select:undefined});
						}
						
						// for(var i=0;i<2;i++)
						cache.treeData.push(angular.copy(tree));
					}
				}else{
					cache.levelList=[];
				}
				$scope.$apply();
			},"json")
		}
		
		$scope.add=function(){
			var post_data={
				func_name:'TagRelationLevel::insert',
				arg:{
					tid:$scope.cache.tagType.select,
					sort_id:$scope.cache.levelList.length || 0,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					cache.levelList.push(res.insert);
				}
				$scope.$apply();
			},"json")
		}
		
	}]
});