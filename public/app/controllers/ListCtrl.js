angular.module('app').controller('ListCtrl',['$scope','level',function($scope,level){
	$scope.level=level;
	$scope.add=function(name){
		var post_data={
			func_name:'TagList::insert',
			arg:{
				name:name,//申請理由
			}
		}
		$.post("ajax.php",post_data,function(res){
			if(res.status){
				$scope.list.push(res.insert)
			}
			alert(res.message);
			$scope.$apply();
		},"json")
	}
	$scope.get=function(){
		$scope.list=[]
		var post_data={
			func_name:'TagList::getList',
			arg:{}
		}
		$.post("ajax.php",post_data,function(res){
			// console.log(res)
			if(res.status){
				$scope.list=res.list;
			}
			$scope.$apply();
		},"json")
	}
	
	
	$scope.del=function(index){
		var post_data={
			func_name:'TagList::delete',
			arg:{
				id:$scope.list[index].id,
			}
		}
		$.post("ajax.php",post_data,function(res){
			console.log(res)
			if(res.status){
				$scope.list.splice(index,1)
			}
			alert(res.message)
			$scope.$apply();
		},"json")
	}
	
	$scope.update=function(index,update,where){
		var timer_key=JSON.stringify(Object.keys(where))+index;
		clearTimeout($scope[timer_key])
		$scope[timer_key]=setTimeout(function(){
			var post_data={
				func_name:'TagList::update',
				arg:{
					where:where,
					update:update,
				}
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					for(var i in update)
					$scope.list[index][i]=update[i];
				}
				console.log(res.message)
				$scope.$apply();
			},"json")			
		},500)
	}
	
	$scope.get();
}])
