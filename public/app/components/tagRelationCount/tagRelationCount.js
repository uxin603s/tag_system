angular.module("app").component("tagRelationCount",{
	bindings:{
		levelIndex:"=",
	},
	templateUrl:'app/components/tagRelationCount/tagRelationCount.html?t='+Date.now(),
	controller:["$scope","cache",function($scope,cache){
		$scope.delete_level=function(id){
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
		$scope.add_tag_name=function(name,callback){
			// console.log(name)
			if(name==""){
				alert("標籤不能空白")
				return;
			}
			var post_data={
				func_name:'TagName::insert',
				arg:{
					name:name,
				},
			}
			$.post("ajax.php",post_data,function(res){
				callback && callback(res.id)
			},"json")
		}
		
		var nameToId=function(name,return_type){
			return new Promise(function(resolve,reject) {
				var post_data={
					func_name:'TagName::getList',
					arg:{
						where_list:[
							{field:'name',type:2,value:name},
						],
					},
				}
				$.post("ajax.php",post_data,function(res){
					if(res.status){
						var ids=res.list.map(function(value){
							return value.id;
						})
						if(return_type){//搜尋模式
							resolve && resolve(ids)
						}else{//新增模式
							resolve && resolve(ids.pop())
						}
					}else{
						if(return_type){//搜尋模式
							resolve && resolve()
						}else{//新增模式
							$scope.add_tag_name(name,function(id){
								resolve && resolve(id)
							})
						}
					}
				},"json")	
			})
		}
		var search_tag_name=function(){
			return new Promise(function(resolve,reject) {
				if($scope.tag.name){
					//搜尋模式
					nameToId("%"+$scope.tag.name+"%",1).then(function(ids){
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
					var post_data={
						func_name:'TagRelation::getList',
						arg:{
							where_list:where_list,
						},
					}
					$.post("ajax.php",post_data,function(res){
						if(res.status){
							for(var i in res.list){
								ids.push(res.list[i].child_id);
							}
							resolve(ids);
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
						var id=ids[i];
						where_list.push({field:'id',type:0,value:id})
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
						$scope.cache.levelList[$scope.$ctrl.levelIndex].list=res.list;
					}
					$scope.$apply();
				},"json")
			});
		}
		
		$scope.get=function(){
			$scope.cache.levelList[$scope.$ctrl.levelIndex].list=[]
			clearTimeout($scope.Timer);
			$scope.Timer=setTimeout(function(){
				search_tag_name().then(function(ids){
					return search_select_tag(ids);
				}).then(function(ids){
					return get_list(ids);
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
		
		$scope.$watch("cache.levelList["+$scope.$ctrl.levelIndex+"].list",function(list){
			if(!list.length)return;
			$scope.cache.tag_name || ($scope.cache.tag_name={});
			var where_list=[];
			for(var i in list){
				var id=list[i].id;
				if(!$scope.cache.tag_name[id]){
					where_list.push({field:'id',type:0,value:id})
				}
			}
			var post_data={
				func_name:'TagName::getList',
				arg:{
					where_list:where_list,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					for(var i in res.list){
						var data=res.list[i];
						var id=data.id;
						var name=data.name;
						$scope.cache.tag_name[id]=name;
					}
					$scope.$apply();
				}
			},"json")
		},1)
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
			nameToId(name).then(function(id){
				
				if($scope.$ctrl.levelIndex==0){
					return TagRelationCount_insert(id);
				}else if(isNaN(cache.levelList[$scope.$ctrl.levelIndex-1].select)){
					alert("請選擇上一層");
					return ;
				}else{
					if(cache.levelList[$scope.$ctrl.levelIndex-1].select==id){
						alert("不能跟父層同名");
						return;
					}						
					return TagRelation_insert(id);
				}
			}).then(function(id){
				if(id)
				return TagRelationCount_insert(id);
			});
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
			TagRelation_delete(id).then(function(id){
				return TagRelationCount_delete(id)
			})
		}
	}]
})
