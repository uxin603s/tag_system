angular.module('app').controller('LevelCtrl',['$scope',function($scope){
	$scope.search_tag_name_tmp={};
	$scope.tagName={};
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
	
	//TagRelationCount
	$scope.insertTagRelationCountList=function(data){
		var count=data.count;
		var id=data.id;
		var level_id=data.level_id;
		
		if(!$scope.tagName[id]){
			$scope.search_tag_name_tmp[id]=id;
		}
		
		$scope.TagRelationCountList || ($scope.TagRelationCountList={});
		$scope.TagRelationCountList[level_id] || ($scope.TagRelationCountList[level_id]=[])
		
		var index=$scope.TagRelationCountList[level_id].findIndex(function(value){
			return value.id==id;
		});
		if(index==-1){
			$scope.TagRelationCountList[level_id].push({id:id,count:count});
		}else{
			console.log('重複了')
		}
	}
	$scope.insertTagRelationCount=function(level_id,name){
		if(!name)return
		var post_data={
			func_name:'TagRelationCount::insert',
			arg:{
				level_id:level_id,
				name:name,
			}
		}
		$.post("ajax.php",post_data,function(res){
			$scope.insertTagRelationCountList(res.insert);
			$scope.$apply();
		},"json")
	}
	$scope.getTagRelationCountList=function(level_id){
		
		var post_data={
			func_name:'TagRelationCount::getList',
			arg:{
				level_id:level_id,
			}
		}
		$.post("ajax.php",post_data,function(res){
			if(res.status){
				for(var i in res.list){
					$scope.insertTagRelationCountList(res.list[i]);
				}
			}
			$scope.$apply();
		},"json")
	}
	
	//TagRelation
	$scope.insertTagRelationList=function(data,count_plus){
		
		var id=data.id;
		var child_id=data.child_id;
		// console.log($scope.tagName[id])
		if(!$scope.tagName[id]){
			$scope.search_tag_name_tmp[id]=id;
		}
		if(!$scope.tagName[child_id]){
			$scope.search_tag_name_tmp[child_id]=child_id;
		}
		
		
		var level_id=data.level_id;
		$scope.TagRelationList || ($scope.TagRelationList={});
		$scope.TagRelationList[level_id] || ($scope.TagRelationList[level_id]={})
		$scope.TagRelationList[level_id][id] || ($scope.TagRelationList[level_id][id]=[])
		
		var index=$scope.TagRelationList[level_id][id].findIndex(function(value){
			return value==child_id;
		});
		if(index==-1){
			$scope.TagRelationList[level_id][id].push(child_id);
			if(count_plus){
				for(var i in $scope.TagRelationCountList[level_id]){
					if($scope.TagRelationCountList[level_id][i].id==id){
						$scope.TagRelationCountList[level_id][i].count++;
						break;
					}
				}
			}
		}
	}
	$scope.insertTagRelation=function(level_id,id,name){
		console.log(level_id,id,name)
		var post_data={
			func_name:'TagRelation::insert',
			arg:{
				level_id:level_id,
				id:id,
				name:name,
			}
		}
		$.post("ajax.php",post_data,function(res){
			if(res.insert){
				$scope.insertTagRelationList(res.insert,true);
				$scope.$apply();
			}
		},"json")
	}
	$scope.getTagRelationList=function(level_id,id){
		var post_data={
			func_name:'TagRelation::getList',
			arg:{
				level_id:level_id,
				id:id,
			}
		}
		$.post("ajax.php",post_data,function(res){
			if(res.status){
				for(var i in res.list){
					$scope.insertTagRelationList(res.list[i]);
				}
			}
			$scope.$apply();
		},"json")
	}
	
	$scope.$watch("TagLevelList",function(list){
		for(var i in list){
			$scope.getTagRelationCountList(list[i].id);
		}
	},1)
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
						}
					}
					$scope.search_tag_name_tmp={};
					$scope.$apply();
				},"json")
			}.bind(this,tid_arr),500)
			
		}
	},1)
	// $scope.$watch("tagName",function(value){
		// console.log(value)
	// },1)
}])
