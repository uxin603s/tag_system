angular.module("app").component("tagRelationCount",{
	bindings:{
		levelIndex:"=",
	},
	templateUrl:'app/components/tagRelationCount/tagRelationCount.html?t='+Date.now(),
	controller:["$scope","cache",function($scope,cache){
		
		//调用
		var a=function(m){
			return new Promise(function(resolve) {
				setTimeout(function(){
					resolve(m)
				},500)
			})
		}
		
		
		a(1).then(function(value){
			console.log(value);
			return a(2)
		}).then(function(value){
			console.log(value);
			return a(3)
		}).then(function(value){
			console.log(value);
			return a(4)
		}).then(function(value){
			console.log(value);
			return a(5)
		})
		
		$scope.cache=cache;
		$scope.tag={};
		
		var get_list=function(ids){
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
		}
		
		$scope.get=function(ids){
			ids || (ids=[])
			
			if($scope.$ctrl.levelIndex==0){
				get_list(ids);
			}
			else if(!isNaN(cache.levelList[$scope.$ctrl.levelIndex-1].select)){
				// console.log("有選")
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
						get_list(ids);
					}
					$scope.$apply();
				},"json")
			}
		}		
		var search_id=function(value){
			$scope.cache.levelList[$scope.$ctrl.levelIndex].list=[]

			clearTimeout($scope.Timer);
			$scope.Timer=setTimeout(function(){
				if($scope.tag.name){
					$scope.nameToId("%"+$scope.tag.name+"%",function(ids){
						if(ids){
							$scope.get(ids);
						}
					},1)//搜尋模式
				}else{
					$scope.get();
				}
			},500)
		}
		$scope.$watch("tag.name",search_id,1);
		
		$scope.nameToId=function(name,callback,return_type){
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
						callback && callback(ids)
					}else{//新增模式
						callback && callback(ids.pop())
					}
				}else{
					if(return_type){//搜尋模式
						callback && callback()
					}else{//新增模式
						$scope.insert(name,function(id){
							callback && callback(id)
						})
					}
				}
			},"json")
		}
		$scope.$watch("cache.levelList["+($scope.$ctrl.levelIndex-1)+"].select",function(value){
			$scope.cache.levelList[$scope.$ctrl.levelIndex].list=[];
			for(var i in $scope.cache.levelList){
				if(i>$scope.$ctrl.levelIndex){
					$scope.cache.levelList[i].list=[];
				}
				if(i>$scope.$ctrl.levelIndex-1)
					delete $scope.cache.levelList[i].select;
			}
			// console.log("第"+$scope.$ctrl.levelIndex+"層，select",value)
			search_id();
		},1);
		$scope.$watch("cache.levelList["+$scope.$ctrl.levelIndex+"].data",function(value){
			if(!value)return;
			// console.log("第"+$scope.$ctrl.levelIndex+"層，init",$scope.cache.levelList[$scope.$ctrl.levelIndex].list)
			if($scope.$ctrl.levelIndex!=0){
				$scope.p_level_id=$scope.cache.levelList[$scope.$ctrl.levelIndex-1].data.id
			}
			$scope.level_id=value.id;
			search_id();
		},1)
	
		
		$scope.insert=function(name,callback){
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
		
		var add=function(id){
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
		}
		$scope.add=function(name){
			$scope.nameToId(name,function(id){
				
				if(cache.levelList[$scope.$ctrl.levelIndex-1].select==id){
					alert("不能跟父層同名");
					return;
				}
					
				if($scope.$ctrl.levelIndex!=0){
					if(isNaN(cache.levelList[$scope.$ctrl.levelIndex-1].select)){
						alert("請選擇上一層");
						return;
					}
				}
				
				if($scope.$ctrl.levelIndex==0){
					add(id);
				}else if(!isNaN(cache.levelList[$scope.$ctrl.levelIndex-1].select)){
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
							add(id);
						}
					},"json")
				}
			});
		}
		
		$scope.del=function(id){
			var post_data={
				func_name:'TagRelation::delete',
				arg:{
					level_id:$scope.p_level_id,
					id:$scope.cache.levelList[$scope.$ctrl.levelIndex-1].select,
				},
			}
			$.post("ajax.php",post_data,function(res){
				// console.log(res)
				if(res.status){
					var data=cache.levelList[$scope.$ctrl.levelIndex-1];
					var find_data=data.list.find(function(value){
						return value.id==cache.levelList[$scope.$ctrl.levelIndex-1].select
					})
					if(find_data){
						find_data.count--;
					}
				}
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
				$scope.$apply();
			},"json")
		}
	}]
})
