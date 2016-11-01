angular.module('app').component("tagType",{
	bindings:{},
	templateUrl:'app/components/tagType/tagType.html?t='+Date.now(),
	controller:["$scope","cache",function($scope,cache){
		$scope.cache=cache;
		$scope.cache.tagType || ($scope.cache.tagType={})
		$scope.$watch("cache.tagType",function(value){
			console.log(value)
			$scope.get();
		})
		$scope.add=function(tagType){
			var post_data={
				func_name:'TagType::insert',
				arg:{
					name:tagType.name,
				}
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					$scope.cache.tagType.list.push(res.insert)
					tagType.name='';
				}
				$scope.$apply();
			},"json")
		}
		$scope.get=function(){
			var post_data={
				func_name:'TagType::getList',
				arg:{}
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					$scope.cache.tagType.list=res.list;
				}else{
					$scope.cache.tagType.list=[];
				}
				$scope.$apply();
			},"json")
		}
		$scope.del=function(index){
			if(!confirm("確認刪除?"))return;
			var post_data={
				func_name:'TagType::delete',
				arg:{
					id:$scope.cache.tagType.list[index].id,
				}
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					$scope.cache.tagType.list.splice(index,1);
					$scope.$apply();
				}
			},"json")
		}
		
		
	}],
})

