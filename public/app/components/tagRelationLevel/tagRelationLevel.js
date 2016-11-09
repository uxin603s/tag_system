angular.module('app').component("tagRelationLevel",{
	bindings:{},
	templateUrl:'app/components/tagRelationLevel/tagRelationLevel.html?t='+Date.now(),
	controller:["$scope","cache","tagRelationCount",function($scope,cache,tagRelationCount){
		$scope.cache=cache;
		$scope.$watch("cache.tagType.select",$scope.get,1);
		$scope.$watch("cache.levelList.length",function(value){
			if(!cache.levelList)return;
			// if(!cache.treeData){
				cache.treeData=[];
				var tree=[];
				for(var i in cache.levelList){
					tree.push({list:[],select:undefined});
				}
				// console.log(cache.levelList[0].id)
				if(cache.levelList.length>2){
					tagRelationCount.get([
						{field:'level_id',type:0,value:cache.levelList[0].id},
					])
					.then(function(res){
						if(res.status){
							var list=res.list;
							for(var i in list){
								tree[0].list=list;
								tree[0].select=list[i].id;
								cache.treeData.push(angular.copy(tree));
							}
							$scope.$apply();
						}
					})
				}else{
					cache.treeData.push(angular.copy(tree));
				}
			// }
		})
		$scope.get=function(){
			if(!$scope.cache.tagType.select)return;
			var post_data={
				func_name:'TagRelationLevel::getList',
				arg:{
					tid:$scope.cache.tagType.select,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					cache.levelList=res.list;
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
		$scope.del=function(index){
			if(!confirm("確認刪除?")){
				return;
			}
			var post_data={
				func_name:'TagRelationLevel::delete',
				arg:{
					id:cache.levelList[index].id,
					tid:cache.tagType.select,
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