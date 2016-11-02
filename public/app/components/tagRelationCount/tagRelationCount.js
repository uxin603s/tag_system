angular.module("app").component("tagRelationCount",{
	bindings:{
		levelIndex:"=",
	},
	templateUrl:'app/components/tagRelationCount/tagRelationCount.html?t='+Date.now(),
	controller:["$scope","cache","tagName",function($scope,cache,tagName){
		$scope.delete_level=function(id){
			if(!confirm("確認刪除?")){
				return;
			}
			var post_data={
				func_name:'TagRelationLevel::delete',
				arg:{
					id:id,
					tid:$scope.cache.selectTagType,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					var index=cache.levelList.findIndex(function(value){
						return value.data.id==id
					});
					if(index!=-1){
						cache.levelList.splice(index,1);
					}
					$scope.$apply();
				}
			},"json")
		}
		$scope.cache=cache;
		$scope.tag={};
		
		
		var search_tag_name=function(){
			return new Promise(function(resolve,reject) {
				if($scope.tag.name){
					//搜尋模式
					tagName.nameToId("%"+$scope.tag.name+"%",1).then(function(ids){
						if(ids){
							resolve(ids);
						}
					})
				}else{
					resolve();
				}
			});
		}
		var search_select_tag=function(ids){
			return new Promise(function(resolve,reject) {
				ids || (ids=[])
				if($scope.$ctrl.levelIndex==0){
					resolve(ids);
				}
				else if(!isNaN(cache.levelList[$scope.$ctrl.levelIndex-1].select)){
					var where_list=[
						{field:'level_id',type:0,value:$scope.p_level_id},
						{field:'id',type:0,value:cache.levelList[$scope.$ctrl.levelIndex-1].select},
					];
					for(var i in ids){
						where_list.push({field:'child_id',type:0,value:ids[i]})
					}
					var post_data={
						func_name:'TagRelation::getList',
						arg:{
							where_list:where_list,
						},
					}
					$.post("ajax.php",post_data,function(res){
						var child_ids=[];
						if(res.status){
							for(var i in res.list){
								child_ids.push(res.list[i].child_id);
							}
							resolve(child_ids);
						}else{
							reject("沒有關聯");
						}
						$scope.$apply();
					},"json")
				}
			});
		}
		var get_list=function(ids){
			return new Promise(function(resolve,reject) {
				var where_list=[
					{field:'level_id',type:0,value:$scope.level_id},
				];
				if(ids){
					for(var i in ids){
						where_list.push({field:'id',type:0,value:ids[i]})
					}
				}
				var post_data={
					func_name:'TagRelationCount::getList',
					arg:{
						where_list:where_list,
					},
				}
				$.post("ajax.php",post_data,function(res){
					if(res.status){
						var list=res.list;
						$scope.cache.levelList[$scope.$ctrl.levelIndex].list=list;
						resolve(list);
					}else{
						reject("沒有資料")
					}
					$scope.$apply();
				},"json")
			});
		}
		
		$scope.get=function(){
			$scope.cache.levelList[$scope.$ctrl.levelIndex].list=[]
			clearTimeout($scope.Timer);
			$scope.Timer=setTimeout(function(){
				search_tag_name()
				.then(function(ids){
					return search_select_tag(ids);
				})
				.then(function(ids){
					return get_list(ids);
				})
				.then(function(list){
					$scope.cache.tag_name || ($scope.cache.tag_name={});
					var where_list=[];
					for(var i in list){
						var id=list[i].id;
						if(!$scope.cache.tag_name[id]){
							where_list.push({field:'id',type:0,value:id})
						}
					}
					if(where_list.length){
						return tagName.getList(where_list);
					}else{
						return Promise.reject("不需要tagName");
					}
				})
				.then(function(list){
					if(res.status){
						for(var i in res.list){
							var data=res.list[i];
							$scope.cache.tag_name[data.id]=data.name;
						}
						$scope.$apply();
					}
				})
				.catch(function(message){
					console.log(message)
				})
			},500)
		}
		
		$scope.$watch("tag.name",$scope.get,1);
		
		$scope.$watch("cache.levelList["+($scope.$ctrl.levelIndex-1)+"].select",function(value){
			$scope.cache.levelList[$scope.$ctrl.levelIndex].list=[];
			var start=$scope.$ctrl.levelIndex;
			var count=$scope.cache.levelList.length;
			for(var i=start;i<count;i++){
				$scope.cache.levelList[i].list=[];
				$scope.cache.levelList[i].select=undefined;
			}
			// console.log("第"+$scope.$ctrl.levelIndex+"層，select",value)
			$scope.get();
		},1);
		
		
		$scope.$watch("cache.levelList["+$scope.$ctrl.levelIndex+"].data",function(value){
			if(!value)return;
			// console.log("第"+$scope.$ctrl.levelIndex+"層，init",$scope.cache.levelList[$scope.$ctrl.levelIndex].list)
			if($scope.$ctrl.levelIndex!=0){
				$scope.p_level_id=$scope.cache.levelList[$scope.$ctrl.levelIndex-1].data.id
			}
			$scope.level_id=value.id;
			$scope.get();
		},1)
		
		var TagRelationCount_insert=function(id){
			return new Promise(function(resolve,reject) {
				var post_data={
					func_name:'TagRelationCount::insert',
					arg:{
						level_id:$scope.level_id,
						id:id,
					},
				}
				$.post("ajax.php",post_data,function(res){
					$scope.cache.levelList[$scope.$ctrl.levelIndex].list.push(res)
					$scope.$apply();
				},"json")
			})
		}
		var TagRelation_insert=function(id){
			return new Promise(function(resolve,reject) {
				var post_data={
					func_name:'TagRelation::insert',
					arg:{
						level_id:$scope.p_level_id,
						id:cache.levelList[$scope.$ctrl.levelIndex-1].select,
						child_id:id,
					},
				}
				$.post("ajax.php",post_data,function(res){
					console.log(res)
					if(res.status){
						var data=cache.levelList[$scope.$ctrl.levelIndex-1];
						var find_data=data.list.find(function(value){
							return value.id==cache.levelList[$scope.$ctrl.levelIndex-1].select
						})
						if(find_data){
							find_data.count++;
						}
						$scope.$apply();
						resolve(id);
					}
				},"json")
			})
		}
		$scope.add=function(name){
			tagName.nameToId(name).then(function(id){
				if($scope.$ctrl.levelIndex==0){
					return TagRelationCount_insert(id);
				}else if(isNaN(cache.levelList[$scope.$ctrl.levelIndex-1].select)){
					return Promise.reject("請選擇上一層")
				}else{
					if(cache.levelList[$scope.$ctrl.levelIndex-1].select==id){
						return Promise.reject("不能跟父層同名")
					}else{				
						return TagRelation_insert(id);
					}
				}
			}).then(function(id){
				return TagRelationCount_insert(id);
			})
			.catch(function(message){
				alert(message)
			})
			
		}
		var TagRelation_delete=function(id){
			return new Promise(function(resolve,reject) {
				if($scope.$ctrl.levelIndex==0){
					resolve(id)
				}else{
					var post_data={
						func_name:'TagRelation::delete',
						arg:{
							level_id:$scope.p_level_id,
							id:$scope.cache.levelList[$scope.$ctrl.levelIndex-1].select,
							child_id:id,
						},
					}
					$.post("ajax.php",post_data,function(res){
						if(res.status){
							var data=cache.levelList[$scope.$ctrl.levelIndex-1];
							var find_data=data.list.find(function(value){
								return value.id==cache.levelList[$scope.$ctrl.levelIndex-1].select
							})
							if(find_data){
								find_data.count--;
							}
						}
						resolve(id)
						$scope.$apply();
					},"json")
				}
			});
		}
		var TagRelationCount_delete=function(id){
			return new Promise(function(resolve,reject) {
				var post_data={
					func_name:'TagRelationCount::delete',
					arg:{
						p_level_id:$scope.p_level_id,
						level_id:$scope.level_id,
						id:id,
					},
				}
				$.post("ajax.php",post_data,function(res){
					if(res.status){
						var index=$scope.cache.levelList[$scope.$ctrl.levelIndex].list.findIndex(function(value){
							return value.id==id
						})
						if(index!=-1)
						$scope.cache.levelList[$scope.$ctrl.levelIndex].list.splice(index,1);
					}
					$scope.$apply();
				},"json")
			})
		}
		
		$scope.del=function(id){
			if(!confirm("確認刪除?")){
				return;
			}
			TagRelation_delete(id).then(function(id){
				return TagRelationCount_delete(id);
			})
		}
	}]
})
