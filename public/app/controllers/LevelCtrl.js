angular.module('app').controller('LevelCtrl',['$scope',function($scope){
	$scope.search_tag_name_tmp={};
	$scope.tagName={};
	// $scope.tagName_r={};
	$scope.getTagLevelList=function(){
		$scope.list=[];
		var post_data={
			func_name:'TagLevel::getList',
			arg:{
				api_id:$scope.user_config.select_api_level,
			}
		}
		$.post("ajax.php",post_data,function(res){
			// console.log(res)
			if(res.status){
				$scope.TagLevelList=res.list;
			}
			$scope.$apply();
		},"json")
	}
	$scope.getTagLevelList();
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
				$scope.TagLevelList.unshift(res.insert);
			}
			$scope.$apply();
		},"json")
	}
	$scope.update_sort_id=function(index){
		if(!$scope.TagLevelList[index])return;
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
			console.log(res)
			$scope.$apply();
		},"json")
	}
	$scope.$watch("TagLevelList",function(list){
		if(!list)return;
		for(var i in list){
			$scope.update_sort_id(i)
		}
	},1);
	$scope.check_add=function(list,field,tag_name){
		console.log(list,field,tag_name)
		for(var i in list){
			
			if(list[i][field]==tag_name){
				return true;
			}
		}
		return false;
	}
	//TagRelationCount
	
	$scope.getTagRelationCountList=function(search,callback){
		var return_data=[];
		var post_data={
			func_name:'TagRelationCount::getList',
			arg:search,
		}
		$.post("ajax.php",post_data,function(res){
			// console.log(res)
			if(res.status){
				for(var i in res.list){
					var data=res.list[i];
					return_data.push(data);
					
					if(!$scope.tagName[data.id]){
						$scope.search_tag_name_tmp[data.id]=data.id;
					}
				}
				callback && callback(return_data)
			}
			$scope.$apply();
		},"json")
		return return_data;
	}
	$scope.insertTagRelationCount=function(search){
		
		var return_data=[];
		var post_data={
			func_name:'TagRelationCount::insert',
			arg:search,
		}
		$.post("ajax.php",post_data,function(res){
			$scope.getTagRelationCountList(search,function(data){
				console.log(data)
				for(var i in data){
					return_data.push(data[i]);
				}
			});
			$scope.$apply();
		},"json")
		return return_data;
	}
	//TagRelation
	
	$scope.getTagRelationList=function(search,callback){
		var return_data=[];
		var post_data={
			func_name:'TagRelation::getList',
			arg:search,
		}
		$.post("ajax.php",post_data,function(res){
			if(res.status){
				for(var i in res.list){
					var data=res.list[i];
					return_data.push(data);
					if(!$scope.tagName[data.child_id]){
						$scope.search_tag_name_tmp[data.child_id]=data.child_id;
					}
				}
				callback && callback(return_data)
			}
			$scope.$apply();
		},"json")
		return return_data;
	}
	
	$scope.insertTagRelation=function(search){
		var return_data=[];
		var post_data={
			func_name:'TagRelation::insert',
			arg:search,
		}
		$.post("ajax.php",post_data,function(res){
			$scope.getTagRelationList(search,function(data){
				console.log(data)
				for(var i in data){
					return_data.push(data[i]);
				}
			});
			$scope.$apply();
		},"json")
		return return_data;
	}
	
	$scope.$watch("search_tag_name_tmp",function(value){
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
							// $scope.tagName_r[name]=id;
						}
					}
					$scope.search_tag_name_tmp={};
					$scope.$apply();
				},"json")
			}.bind(this,tid_arr),500)
		}
	},1)
}])
