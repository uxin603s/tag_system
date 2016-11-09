angular.module('app').component("tagSearch",{
	bindings:{},
	templateUrl:'app/components/tagSearch/tagSearch.html?t='+Date.now(),
	controller:["$scope","cache","tagName","aliasList","tagRelation",function($scope,cache,tagName,aliasList,tagRelation){
		$scope.cache=cache;
		$scope.cache.tag_search || ($scope.cache.tag_search={});
		$scope.cache.tag_search.search || ($scope.cache.tag_search.search=[]);
		
		var tag_search_id=function(){
			clearTimeout($scope.tag_search_id_timer)
			$scope.tag_search_id_timer=setTimeout(function(){
				promiseRecursive(function* (){
					if(!$scope.cache.tag_search.search.length){
						$scope.cache.tag_search.result=[]
						yield Promise.reject("搜不到標籤");
					}
					
					var value=$scope.cache.tag_search.search.map(function(val){
						return val.name;
					});
					
					var list=yield tagName.nameToId(value,1);
					if($scope.cache.tag_search.search.length==list.length){
						var require_id=[];
						var option_id=[];
						for(var i in list){
							var data=list[i];
							var id=data.id;
							var name=data.name;
							var find=$scope.cache.tag_search.search.find(function(val){
								return val.name==name;
							});
							if(find.type){
								option_id.push(id);
							}else{
								require_id.push(id)
							}
						}
						
						var res=yield tagRelation.get_inter(require_id,option_id);
						if(res.status){
							var where_list=[
								{field:'wid',type:0,value:$scope.cache.webList.select},
							];
							for(var i in res.list){
								where_list.push({field:'id',type:0,value:res.list[i].child_id})
							}
							var res=yield aliasList.get(where_list);//把id轉換成source_id
							if(res.status){
								$scope.cache.tag_search.result=res.list.map(function(value){
									return value.source_id;
								})
							}else{
								$scope.cache.tag_search.result=[];
							}
							$scope.$apply()
						}
					}else{
						yield Promise.reject("標籤有些不存在");
					}
				}())
			},500);
		}
		
		$scope.$watch("cache.tag_search.search",function(value){
			
			if(!value)return;
			tag_search_id();
		},1);
		
		$scope.add_tag_search=function(name){
			
			var index=$scope.cache.tag_search.search.findIndex(function(val){
				return val.name==name;
			})
			if(index==-1){
				$scope.cache.tag_search.search.push({name:name});
			}
		}
		$scope.del_tag_search=function(index){
			$scope.cache.tag_search.search.splice(index,1);
		}
		$scope.$watch("cache.treeData",function(curr,prev){
			return;
			var tagName=$scope.cache.tagName;
			// $scope.cache.tag_search.search=[];
			
			for(var i in curr){
				// if(curr[i]){
					// var list=curr[i][curr[i].length-1].list;
					// for(var i in list){
						// var tag=tagName[list[i].id]
						// var index=$scope.cache.tag_search.search.findIndex(function(val){
							// return val.name==tag
						// });
						// if(index==-1){
							// $scope.cache.tag_search.search.push({name:tag,type:1})
						// }
					// }
				// }
				// if(prev[i]){
					// var list=prev[i][prev[i].length-1].list;
					// for(var i in list){
						// var tag=tagName[list[i].id]
						// var index=$scope.cache.tag_search.search.findIndex(function(val){
							// return val.name==tag
						// });
						// if(index!=-1){
							// $scope.cache.tag_search.search.splice(index,1)
						// }
					// }
				// }
				// var list=prev[i][prev[i].length-1].list;
				// for(var i in list){
					// if(curr_select==list[i].id)continue;
					// var tag=tagName[list[i].id]
					// var index=$scope.cache.tag_search.search.findIndex(function(val){
						// return val.name==tag
					// });
					// if(index!=-1){
						// $scope.cache.tag_search.search.splice(index,1)
					// }
				// }
				if(curr[i]){
					var curr_select=curr[i][curr[i].length-1].select;
					if(curr_select){
						var tag=tagName[curr_select];
						var index=$scope.cache.tag_search.search.findIndex(function(val){
							return val.name==tag
						});
						if(index==-1){
							$scope.cache.tag_search.search.push({name:tag})
						}else{
							delete $scope.cache.tag_search.search[index].type;
						}
					}
					// var list=curr[i][curr[i].length-1].list
					// if(!list.length){
						
					// }
					// console.log(list)
				}
				if(prev[i]){
					var prev_select=prev[i][prev[i].length-1].select;
					if(prev_select && curr_select!=prev_select){
						var tag=tagName[prev_select];
						var index=$scope.cache.tag_search.search.findIndex(function(val){
							return val.name==tag
						});
						if(index!=-1){
							$scope.cache.tag_search.search.splice(index,1)
						}
					}
					// console.log(curr_select)
					// if(curr_select){
						// var list=prev[i][prev[i].length-1].list;
						// for(var i in list){
							// if(curr_select==list[i].id)continue;
							// var tag=tagName[list[i].id]
							// var index=$scope.cache.tag_search.search.findIndex(function(val){
								// return val.name==tag
							// });
							// if(index!=-1){
								// $scope.cache.tag_search.search.splice(index,1)
							// }
						// }
					// }else{
						// var list=curr[i][curr[i].length-1].list;
						// for(var i in list){
							// var tag=tagName[list[i].id]
							// var index=$scope.cache.tag_search.search.findIndex(function(val){
								// return val.name==tag
							// });
							// if(index==-1){
								// $scope.cache.tag_search.search.push({name:tag,type:1})
							// }
						// }
					// }
				}
					
				
				
			}
		},1)
		$scope.watch_treeData=[];
		$scope.$watch("cache.treeData",function(treeData){
			return
			while($scope.watch_treeData[0]){
				$scope.watch_treeData.splice(0,1).pop()();
			}
			var tagName=$scope.cache.tagName;
			// return
			for(var i in treeData){
				if(0 && treeData.length==1)
				$scope.watch_treeData.push(
					$scope.$watch("cache.treeData["+i+"]["+(treeData[i].length-1)+"].list",function(curr,prev){
						if(!curr)return;
						if(!prev)return;
						
						for(var i in curr){
							var tag=tagName[curr[i].id];
							var index=$scope.cache.tag_search.search.findIndex(function(val){
								return val.name==tag;
							});
							if(index==-1){
								$scope.cache.tag_search.search.push({name:tag,type:1})
							}
						}
						for(var i in prev){
							var tag=tagName[prev[i].id];
							var index=$scope.cache.tag_search.search.findIndex(function(val){
								return val.name==tag;
							});
							if(index!=-1){
								$scope.cache.tag_search.search.splice(index,1);
							}
						}
					})
				)
				
				$scope.watch_treeData.push(
					$scope.$watch("cache.treeData["+i+"]["+(treeData[i].length-1)+"].select",function(i,curr,prev){
						if(!curr)return;
						
						var prev_tag=tagName[prev];
						var curr_tag=tagName[curr];
						if(prev_tag){
							var index=$scope.cache.tag_search.search.findIndex(function(val){
								return val.name==prev_tag;
							});
							if(index!=-1)
								$scope.cache.tag_search.search.splice(index,1)
						}
						// console.log(treeData.length)
						if(treeData.length==1){
							var list=$scope.cache.treeData[i][$scope.cache.treeData[i].length-1].list.map(function(val){
								return tagName[val.id];
							});
							while(list[0]){
								var index=$scope.cache.tag_search.search.findIndex(function(val){
									return val.name==list[0];
								});
								
								if(curr_tag){
									if(index!=-1)
										$scope.cache.tag_search.search.splice(index,1)
								}
								else{
									if($scope.cache.levelList.length!=1)
									if(index==-1){
										$scope.cache.tag_search.search.push({name:list[0],type:1})
									}
								}
								
								list.splice(0,1);
							}
						}
						
						if(curr_tag){
							var index=$scope.cache.tag_search.search.findIndex(function(val){
								return val.name==curr_tag;
							});
							if(index==-1){
								$scope.cache.tag_search.search.push({name:curr_tag})
							}
						}
					}.bind(this,i),1)
				)
				
				
			}
		})
	}],
})