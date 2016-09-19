angular.module('app').controller('LevelCtrl',['$scope',function($scope){
	
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
	},1)
	
	$scope.getList=function(){
		var post_data={
			func_name:'TagLevel::getList',
			arg:{
				api_id:$scope.user_config.select_api_level,
			}
		}
		$.post("ajax.php",post_data,function(res){
			if(res.status){
				$scope.TagLevelList=res.list;
			}
			$scope.$apply();
		},"json")
	}
	
	$scope.getList();
	$scope.insert=function(){
		var post_data={
			func_name:'TagLevel::insert',
			arg:{
				api_id:$scope.user_config.select_api_level,
			}
		}
		$.post("ajax.php",post_data,function(res){
			console.log(res)
			$scope.TagLevelList || ($scope.TagLevelList=[])
			if(res.status){
				$scope.TagLevelList.push(res.insert);
			}
			$scope.$apply();
		},"json")
	}
	$scope.delete=function(index){
		if(!$scope.TagLevelList[index])return
		var post_data={
			func_name:'TagLevel::delete',
			arg:{
				level_id:$scope.TagLevelList[index].id,
				api_id:$scope.user_config.select_api_level,
			}
		}
		$.post("ajax.php",post_data,function(res){
			if(res.status){
				$scope.TagLevelList.splice(index,1)
			}
			$scope.$apply();
		},"json")
	}
	$scope.sync_relation=function(level_id,type){
		var post_data={
			func_name:'TagRelation::sync',
			arg:{
				api_id:$scope.user_config.select_api_level,
				level_id:level_id,
				type:type,
			}
		}
		$.post("ajax.php",post_data,function(res){
			console.log(res)
			if(res.status){
				$scope.getTagLevelList();
			}
			$scope.$apply();
		},"json")
	}
	$scope.update_tag_level=function(update,where){
		var post_data={
			func_name:'TagLevel::update',
			arg:{
				where:where,
				update:update,
			}
		}
		$.post("ajax.php",post_data,function(res){
			$scope.sync_relation(where.id);
			$scope.$apply();
		},"json")
	}
	
	
	$scope.$watch("TagLevelList",function(list){
		if(!list)return;
		for(var index in list){
			var post_data={
				func_name:'TagApiLevel::update_sort_id',
				arg:{
					api_id:$scope.user_config.select_api_level,
					level_id:$scope.TagLevelList[index].id,
					sort_id:index,
				}
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					$scope.TagLevelList[index].sort_id=index;
				}
				$scope.$apply();
			},"json")		
		}
	},1);
}])
