angular.module('app').controller('ApiCtrl',['$scope',function($scope){
		
	$scope.insert=function(comment){
		var post_data={
			func_name:'TagApi::insert',
			arg:{
				comment:comment,//申請理由
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
	$scope.getList=function(){
		$scope.list=[]
		var post_data={
			func_name:'TagApi::getList',
			arg:{}
		}
		$.post("ajax.php",post_data,function(res){
			if(res.status){
				$scope.list=res.list;
			}
			$scope.$apply();
		},"json")
	}
	$scope.getList();
	$scope.status_arr=[
		{value:0,name:'審核中'},
		{value:1,name:'上架'},
		{value:-1,name:'下架'},
	]
	
	$scope.delete=function(index){
		var post_data={
			func_name:'TagApi::delete',
			arg:{
				id:$scope.list[index].id,
			}
		}
		$.post("ajax.php",post_data,function(res){
			if(res.status){
				$scope.list.splice(index,1)
			}
			console.log(res.message)
			$scope.$apply();
		},"json")
	}
	
	$scope.update=function(index,update){
		var timer_key=JSON.stringify(Object.keys(update))+index;
		clearTimeout($scope[timer_key])
		$scope[timer_key]=setTimeout(function(){
			var post_data={
				func_name:'TagApi::update',
				arg:{
					where:{
						id:$scope.list[index].id,
					},
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
}])
