angular.module('app').controller('LevelCtrl',['$scope','level',function($scope,level){
	
	$scope.searchTagNameTmp={};
	$scope.tagName={};
	$scope.$watch("searchTagNameTmp",function(value){
		if(Object.keys(value).length){
			clearTimeout($scope.search_tag_name_tmp_timer);
			var tid_arr=angular.copy(value);
			$scope.search_tag_name_tmp_timer=setTimeout(function(tid_arr){
				var post_data={
					func_name:'Tag::getTagIdTOName',
					arg:{
						tid_arr:tid_arr,
					}
				}
				$.post("ajax.php",post_data,function(res){
					if(res.status){
						for(var i in res.list){
							var data=res.list[i];
							var id=data.id;
							var name=data.name;
							$scope.tagName[id]=name;
						}
					}
					$scope.searchTagNameTmp={};
					$scope.$apply();
				},"json")
			}.bind(this,tid_arr),500)
		}
	},1);
	$scope.$watch("user_config.select_api_id",function(value){
		if(!value)return;
		var arg={
			api_id:$scope.user_config.select_api_id,
		}
		level.get(arg,function(res){
			$scope.list=[]
			if(res.status){
				$scope.list=res.list;
				$scope.$apply();
			}
		});
	})
	$scope.add=function(add_type){
		var arg={
			api_id:$scope.user_config.select_api_id,
		}
		level.add(arg,function(res){
			if(res.status){
				if(add_type){
					$scope.list.unshift(res.insert);
				}else{
					$scope.list.push(res.insert);
				}
				$scope.$apply();
			}
		});
	}
	$scope.$watch("list",function(data){
		for(var i in data){
			if(data[i].sort_id!=i*1){
				var arg={
					update:{
						sort_id:i,
					},
					where:{
						id:data[i].id,
					},
				};
				level.update(arg,function(res){
					// console.log(res)
				})
				data[i].sort_id=i;
			}
		}
	},1)
	
	
}])
