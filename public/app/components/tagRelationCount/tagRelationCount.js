angular.module("app").component("tagRelationCount",{
	bindings:{
		levelIndex:"=",
		levelList:"=",
		treeData:"=",
	},
	templateUrl:'app/components/tagRelationCount/tagRelationCount.html?t='+Date.now(),
	controller:["$scope","cache","tagName","tagRelation","tagRelationCount",function($scope,cache,tagName,tagRelation,tagRelationCount){
		$scope.cache=cache;
		$scope.tag={};
		
		
		$scope.get=function(){
			clearTimeout($scope.Timer);
			$scope.Timer=setTimeout(function(){
				promiseRecursive(function* (){
					
					var ids;
					if($scope.tag.name){//搜尋模式
						var list=yield tagName.nameToId("%"+$scope.tag.name+"%",1)
						if(list.length){
							var ids=list.map(function(val){
								return val.id;
							});
						}else{
							yield Promise.reject("搜尋不到標籤");
						}
					}
					
					if($scope.$ctrl.levelIndex){
						if(isNaN($scope.$ctrl.treeData[$scope.$ctrl.levelIndex-1].select)){
							
							$scope.$ctrl.treeData[$scope.$ctrl.levelIndex].list=[];
							$scope.$apply();
							// console.log($scope.$ctrl.treeData[$scope.$ctrl.levelIndex-1],$scope.$ctrl.levelIndex)
							yield Promise.reject("沒選上一層");
						}else{
							var level_id=$scope.$ctrl.levelList[$scope.$ctrl.levelIndex-1].id;
							var id=$scope.$ctrl.treeData[$scope.$ctrl.levelIndex-1].select;
							var where_list=[
								{field:'level_id',type:0,value:level_id},
								{field:'id',type:0,value:id},
							];
							for(var i in ids){
								where_list.push({field:'child_id',type:0,value:ids[i]})
							}
							var res= yield tagRelation.get(where_list);
							if(res.status){
								var alias_sort_id={};
								var ids=[];
								for(var i in res.list){
									var data=res.list[i];
									
									var sort_id=data.sort_id;
									var child_id=data.child_id;
									ids.push(child_id);
									alias_sort_id[child_id]=sort_id
								}
							}else{
								$scope.$ctrl.treeData[$scope.$ctrl.levelIndex].list=[];
								$scope.$apply();
								yield Promise.reject("沒有關聯");
							}
						}
					}
					
					var level_id=$scope.$ctrl.levelList[$scope.$ctrl.levelIndex].id;
					
					var where_list=[
						{field:'level_id',type:0,value:level_id},
					];
					if(ids){
						for(var i in ids){
							where_list.push({field:'id',type:0,value:ids[i]})
						}
					}
					var res=yield tagRelationCount.get(where_list);
					
					if(res.status){
						if(alias_sort_id){
							for(var i in res.list){
								res.list[i].sort_id=alias_sort_id[res.list[i].id]
							}
						}
						res.list.sort(function(a,b){
							return a.sort_id-b.sort_id;
						})
						$scope.$ctrl.treeData[$scope.$ctrl.levelIndex].list=res.list;
						
						if($scope.$ctrl.levelList.length-1!=$scope.$ctrl.levelIndex && !$scope.$ctrl.treeData[$scope.$ctrl.levelIndex].select){
							if(res.list[0].count){
								$scope.$ctrl.treeData[$scope.$ctrl.levelIndex].select=res.list[0].id
							}
						}
							
						
						var ids=res.list.map(function(val){
							return val.id;
						})
						yield tagName.idToName(ids);
						$scope.$apply();
					}
					else{
						$scope.$ctrl.treeData[$scope.$ctrl.levelIndex].list=[];
						$scope.$apply();
						yield Promise.reject("tagRelationCount 沒資料");
					}
				}())
			},500)
		}
		
		$scope.$watch("tag.name",$scope.get,1);
		
			
		$scope.$watch("$ctrl.treeData["+($scope.$ctrl.levelIndex-1)+"].select",function(select){
			if($scope.$ctrl.levelIndex-1<0)return
			$scope.get();
			
			// console.log("第"+($scope.$ctrl.levelIndex-1)+"層，select",select)
		},1);
		$scope.$watch("$ctrl.treeData["+($scope.$ctrl.levelIndex)+"].list",function(curr,prev){
			if(!$scope.$ctrl.treeData[$scope.$ctrl.levelIndex].list.some(function(val){
				return val.id==$scope.$ctrl.treeData[$scope.$ctrl.levelIndex].select
			})){
				delete $scope.$ctrl.treeData[$scope.$ctrl.levelIndex].select;
			}
			if(curr.length==0){
				delete $scope.$ctrl.treeData[$scope.$ctrl.levelIndex].select;
			}
		})
		$scope.$watch("$ctrl.treeData["+($scope.$ctrl.levelIndex)+"].list",function(curr,prev){
			// return
			
			if(!curr)return;
			if(!prev)return;
			if(curr.length!=prev.length)return;
			if($scope.tag.name)return;
			clearTimeout($scope.sort_id_timer);
			$scope.sort_id_timer=setTimeout(function(){
				for(var i in curr){
					
					if(curr[i].sort_id!=prev[i].sort_id){
						curr[i].sort_id=i;
						if($scope.$ctrl.levelIndex){
							var id=$scope.$ctrl.treeData[$scope.$ctrl.levelIndex-1].select;
							var level_id=$scope.$ctrl.levelList[$scope.$ctrl.levelIndex-1].id;
							var child_id=curr[i].id
							var sort_id=curr[i].sort_id;
							
							
							tagRelation.ch({
								update:{
									sort_id:sort_id
								},
								where:{
									id:id,
									level_id:level_id,
									child_id:child_id,
								},
							})
							.then(function(res){
								console.log(res);
							})
							// console.log(id,child_id,level_id,sort_id)
						}else{
							
							var id=curr[i].id
							var level_id=$scope.$ctrl.levelList[$scope.$ctrl.levelIndex].id;
							var sort_id=curr[i].sort_id;
							
							tagRelationCount.ch({
								update:{
									sort_id:sort_id
								},
								where:{
									id:id,
									level_id:level_id,
								},
							})
							.then(function(res){
								console.log(res);
							})
							// console.log(id,level_id,sort_id)
						}
					}
				}
			},500)
		},1)

		
		$scope.add=function(name){
			promiseRecursive(function* (name){
				var list=yield tagName.nameToId(name);
				var child_id=list.pop().id;
					
				if($scope.$ctrl.levelIndex){
					if(isNaN($scope.$ctrl.treeData[$scope.$ctrl.levelIndex-1].select)){
						var message="請選擇上一層"
						alert(message);
						yield Promise.reject(message);
					}else{
						if($scope.$ctrl.treeData[$scope.$ctrl.levelIndex-1].select==child_id){
							var message="不能跟父層同名"
							alert(message);
							yield Promise.reject(message);
						}else{	
							var level_id=$scope.$ctrl.levelList[$scope.$ctrl.levelIndex-1].id;
							var treeData=$scope.$ctrl.treeData[$scope.$ctrl.levelIndex-1];
							var id=treeData.select;
							var list=treeData.list;
							var add={
								level_id:level_id,
								id:id,
								child_id:child_id,
								sort_id:99999,
							}
							
							var item=yield tagRelation.add(add,list);
							var child_id=item.child_id;
						}
					}
				}
				// console.log($scope.$ctrl.levelIndex)
				var treeData=$scope.$ctrl.treeData[$scope.$ctrl.levelIndex];
				var list=treeData.list;
				var level_id=$scope.$ctrl.levelList[$scope.$ctrl.levelIndex].id;
				
				
				yield tagRelationCount.add({
					level_id:level_id,
					id:child_id,
					sort_id:99999999999999,
				},list)
				.catch(function(message){
					alert(message)
					console.log(message)
				});
				
				// console.log($scope.tag);
				
				$scope.tag.name='';
				$scope.$apply();
			}(name))
		}
		
		$scope.del=function(index){
			if(!confirm("確認刪除?")){
				return;
			}
			promiseRecursive(function* (index){
				var level_id=$scope.$ctrl.levelList[$scope.$ctrl.levelIndex].id;
				var treeData=$scope.$ctrl.treeData[$scope.$ctrl.levelIndex];
				var id=treeData.list[index].id;
				var list=treeData.list;
				var child_level_id=level_id;
				var child_id=id;
				
				if($scope.$ctrl.levelIndex){//第一層沒有關聯;
					let level_id=$scope.$ctrl.levelList[$scope.$ctrl.levelIndex-1].id;
					let treeData=$scope.$ctrl.treeData[$scope.$ctrl.levelIndex-1];
					let id=treeData.select;
					let list=treeData.list;
					var del={
						level_id:level_id,
						id:id,
						child_id:child_id,
					}
					yield tagRelation.del(del,list);
				}
				var result=yield tagRelationCount.del({
					level_id:level_id,
					id:id,
				},list)
				// console.log(result,del)
				if(!result.status && del){
					yield tagRelation.add(del,list);
				}
				
			}(index));
		}
		
		
	}]
});