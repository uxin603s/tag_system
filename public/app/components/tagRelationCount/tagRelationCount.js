angular.module("app").component("tagRelationCount",{
	bindings:{
		levelIndex:"=",
	},
	templateUrl:'app/components/tagRelationCount/tagRelationCount.html?t='+Date.now(),
	controller:["$scope","cache","tagName","tagRelation",function($scope,cache,tagName,tagRelation){
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
					tagName.nameToId("%"+$scope.tag.name+"%",1)
					.then(function(list){
						if(list.length){
							resolve(list.map(function(val){
								return val.id;
							}));
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
					return tagRelation.get(where_list,function(res){
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
					});
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
					// console.log(list)
					$scope.cache.tag_name || ($scope.cache.tag_name={});
					var where_list=[];
					for(var i in list){
						var id=list[i].id;
						if(!$scope.cache.tag_name[id]){
							where_list.push({field:'id',type:0,value:id})
						}
					}
					// console.log(where_list)
					if(where_list.length){
						return tagName.getList(where_list);
					}else{
						return Promise.reject("不需要tagName");
					}
				})
				.then(function(list){
					for(var i in list){
						var data=list[i];
						$scope.cache.tag_name[data.id]=data.name;
					}
					$scope.$apply();
					
				})
				.catch(function(message){
					// console.log(message)
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
		
		
		$scope.add=function(name){
			
			tagName.nameToId(name)
			.then(function(list){
				var id=list.pop().id;
				if($scope.$ctrl.levelIndex==0){
					return id;
				}else if(isNaN(cache.levelList[$scope.$ctrl.levelIndex-1].select)){
					return Promise.reject("請選擇上一層")
				}else{
					if(cache.levelList[$scope.$ctrl.levelIndex-1].select==id){
						return Promise.reject("不能跟父層同名")
					}else{		
						var add={
							level_id:$scope.p_level_id,
							id:cache.levelList[$scope.$ctrl.levelIndex-1].select,
							child_id:id,
						}
						return tagRelation.add(add).then(function(res){
							if(res.status){
								var data=cache.levelList[$scope.$ctrl.levelIndex-1];
								var find_data=data.list.find(function(value){
									return value.id==cache.levelList[$scope.$ctrl.levelIndex-1].select
								})
								if(find_data){
									find_data.count++;
								}
								return Promise.resolve(id);
							}
						})
					}
				}
			})
			.then(function(id){
				return TagRelationCount_insert(id);
			})
			.catch(function(message){
				alert(message)
				console.log(message)
			})
		}
		
		
		var TagRelationCount_delete=function(index){
			var id=$scope.cache.levelList[$scope.$ctrl.levelIndex].list[index].id;
			return new Promise(function(resolve,reject) {
				var post_data={
					func_name:'TagRelationCount::delete',
					arg:{
						level_id:$scope.level_id,
						id:id,
					},
				}
				$.post("ajax.php",post_data,function(res){
					if(res.status){
						$scope.cache.levelList[$scope.$ctrl.levelIndex].list.splice(index,1);
						resolve(id);
					}else{
						reject("TagRelationCount刪除失敗");
					}
					$scope.$apply();
				},"json")
			})
		}
		
		$scope.del=function(index){
			if(!confirm("確認刪除?")){
				return;
			}
			var id=$scope.cache.levelList[$scope.$ctrl.levelIndex].list[index].id;
			if($scope.$ctrl.levelIndex==0){
				TagRelationCount_delete(index);
				//第一層沒有關聯;
			}else{
				var del={
					level_id:$scope.p_level_id,
					id:$scope.cache.levelList[$scope.$ctrl.levelIndex-1].select,
					child_id:id,
				}
				tagRelation.del(del)
				.then(function(res){
					if(res.status){
						var data=$scope.cache.levelList[$scope.$ctrl.levelIndex-1];
						var find_data=data.list.find(function(value){
							return value.id==$scope.cache.levelList[$scope.$ctrl.levelIndex-1].select
						})
						if(find_data){
							find_data.count--;
						}
						$scope.$apply();
						return id;
					}else{
						return Promise.reject("刪除關聯失敗");
					}
				})
				.then(function(){
					TagRelationCount_delete(index);
				})
				.catch(function(message){
					console.log(message)
				})
			}
		}
	}]
})
