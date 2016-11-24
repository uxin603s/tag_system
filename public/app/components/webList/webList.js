angular.module('app').component("webList",{
	bindings:{},
	templateUrl:'app/components/webList/webList.html?t='+Date.now(),
	controller:["$scope","cache","tagName",function($scope,cache,tagName){
		$scope.cache=cache;
		location.search.match(/wid=(\d+?)/g)
		if(RegExp.$1){
			$scope.uri_wid=RegExp.$1
		}
		$scope.add_relation=function(){
			console.log(cache.webList.list[cache.webList.select].id)

		}
		$scope.get=function(){
			$scope.cache.webList || ($scope.cache.webList={});
			var post_data={
				func_name:'WebList::getList',
				arg:{}
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					$scope.cache.webList.list=res.list;
					if($scope.uri_wid){
						
						var index=$scope.cache.webList.list.findIndex(function(val){
							return val.id==$scope.uri_wid;
						});
						if(index==-1){
							alert("沒有這個網站")
						}else{
							$scope.cache.webList.select=index;
						}
						
					}else{
						$scope.cache.webList.select=0;
					}
				}else{
					$scope.cache.webList.list=[];
				}
				$scope.$apply();
			},"json")
		}
		$scope.add=function(webList){
			var post_data={
				func_name:'WebList::insert',
				arg:{
					name:webList.name,
				}
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					$scope.cache.webList.list.push(res.insert);
					webList.name='';
					$scope.$apply();
				}
				
			},"json")
		}
		$scope.del=function(index){
			if(!confirm("確認刪除?"))return;
			var post_data={
				func_name:'WebList::delete',
				arg:{
					id:$scope.cache.webList.list[index].id,
				}
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					$scope.cache.webList.list.splice(index,1);
					$scope.$apply();
				}
			},"json")
		}
		$scope.get();
	}],
})

