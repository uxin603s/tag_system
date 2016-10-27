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
				// console.log(res)
				if(res.status){
					var new_arr_count=res.list.length;
					cache.levelList || (cache.levelList=[])
					var old_arr_count=cache.levelList.length;
					
					if(old_arr_count>new_arr_count){
						cache.levelList.splice(new_arr_count,old_arr_count-new_arr_count)
					}
					for(var i in res.list){
						if(!cache.levelList[i]){
							cache.levelList.push({data:res.list[i],list:undefined,select:undefined})
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
					tid:$scope.cache.selectTagType,
				},
			}
			$.post("ajax.php",post_data,function(res){
				$scope.get();
			},"json")
		}
		
	}]
});




