angular.module('app').component("tagRelationLevel",{
	bindings:{},
	templateUrl:'app/components/tagRelationLevel/tagRelationLevel.html?t='+Date.now(),
	controller:["$scope","cache",function($scope,cache){
		$scope.cache=cache;
		$scope.$watch("cache.tagType.select",function(value){
			if(!value)return;
			$scope.get();
		},1)
		$scope.get=function(){
			var post_data={
				func_name:'TagRelationLevel::getList',
				arg:{
					tid:$scope.cache.tagType.select,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					var new_arr_count=res.list.length;
					cache.levelList || (cache.levelList=[])
					var old_arr_count=cache.levelList.length;
					
					if(old_arr_count>new_arr_count){
						cache.levelList.splice(new_arr_count,old_arr_count-new_arr_count)
					}
					for(var i in res.list){
						if(!cache.levelList[i]){
							cache.levelList.push({data:res.list[i],list:[],select:undefined})
						}
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
					cache.levelList.push({data:res.insert,list:undefined,select:undefined})
				}
				$scope.$apply();
			},"json")
		}
		
	}]
});