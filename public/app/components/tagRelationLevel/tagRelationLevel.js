angular.module('app').component("tagRelationLevel",{
	bindings:{},
	templateUrl:'app/components/tagRelationLevel/tagRelationLevel.html?t='+Date.now(),
	controller:
	["$scope","cache","tagName",
	function($scope,cache,tagName){
		$scope.cache=cache;
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
		
	}]
});