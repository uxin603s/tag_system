angular.module('app').controller('LevelCtrl',['$scope','level','tagRelation','tagRelationTail',function($scope,level,tagRelation,tagRelationTail){
	$scope.tagRelationTail=tagRelationTail;
	
	$scope.searchTagNameTmp={};
	$scope.tagName={};
	$scope.$watch("searchTagNameTmp",function(value){
		if(Object.keys(value).length){
			clearTimeout($scope.search_tag_name_tmp_timer);
			var tid_arr=angular.copy(value);
			$scope.search_tag_name_tmp_timer=setTimeout(function(tid_arr){
				var post_data={
					func_name:'TagName::getTagIdTOName',
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
	
	function get_inner_tag_relation(list,index,ids,callback){
		var arg={
			ids:ids,
			level_id:list[index].id,
		}
		tagRelation.get(arg,function(ids,res){
			if(res.status){
				var no_repeat=function(res,ids){
					var tmp={};
					for(var i in ids){
						tmp[ids[i]]=ids[i];
					}
					for(var i in res.list){
						var child_id=res.list[i].child_id;
						tmp[child_id]=child_id;
					}
					var ids=[];
					for(var i in tmp){
						ids.push(i);
					}
					return ids;
				}
				if(list[index+1]){
					var ids=no_repeat(res,ids);
					get_inner_tag_relation(list,index+1,ids,callback);
				}else{
					var ids=no_repeat(res)
					callback && callback(ids,index+1);
				}
			}
			$scope.$apply();
		}.bind(this,ids))
		
	}
	
	$scope.$watch("user_config.select_api_id",function(value){
		if(!value)return;
		var arg={
			api_id:$scope.user_config.select_api_id,
		}
		level.get(arg,function(res){
			$scope.list=[];
			
			if(res.status){
				$scope.list=res.list;
			}
			$scope.$apply();
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
	$scope.$watch("tagRelationTail.data.tid",function(tid){
		// console.log(data)
		
		var tid=tagRelationTail.data.tid;
		var levelIndex=tagRelationTail.data.levelIndex;
		if(isNaN(levelIndex))return;
		$scope.add_tag_name=$scope.tagName[tid];
		tagRelationTail.data.list=[];
		get_inner_tag_relation($scope.list,levelIndex,[tid],function(ids,index){
			if(($scope.list.length)==index){
				tagRelationTail.data.list=ids;
			}
		})

	},1)
	$scope.$watch("tagRelationTail.data.tag_names.length",function(){
		tagRelationTail.data.list=[];
		var tag_names=tagRelationTail.data.tag_names
		if(!tag_names.length)return
		
		var arg={
			names_to_ids:tag_names,
			level_id:$scope.list[$scope.list.length-1].id,
		};
		tagRelation.get(arg,function(res){
			if(res.status){
				tagRelationTail.data.list=res.list;
			}
			$scope.$apply();
		})
	},1)
	$scope.del_relation=function(index){
		var arg={
			id:tagRelationTail.data.tag_list[index],
			child_id:tagRelationTail.data.oid,
			level_id:$scope.list[$scope.list.length-1].id,
		}
		// console.log(arg);
		// return
		tagRelation.del(arg,function(res){
			console.log(res)
			$scope.$apply();
		})
		tagRelationTail.data.tag_list.splice(index,1)
	}
	$scope.add_relation=function(name){
		var arg={
			name_to_id:name,
			child_id:tagRelationTail.data.oid,
			level_id:$scope.list[$scope.list.length-1].id,
		}
		tagRelation.add(arg,function(res){
			console.log(res)
			var id=res.insert.id;
			if(tagRelationTail.data.tag_list.indexOf(id)==-1)
				tagRelationTail.data.tag_list.push(id);
			
			if(!$scope.tagName[id]){
				$scope.searchTagNameTmp[id]=id;
			}
			console.log(tagRelationTail.data.tag_list)
			$scope.$apply();
		})
		// tagRelationTail.data.tag_list.splice(index,1)
	}
		
	$scope.$watch("tagRelationTail.data.oid",function(oid){
		tagRelationTail.data.tag_list=[];
		if(!oid)return;
		clearTimeout($scope.tagRelationTail_oid_timer)
		$scope.tagRelationTail_oid_timer=setTimeout(function(){
			var arg={
				child_id:oid,
				level_id:$scope.list[$scope.list.length-1].id,
			};
			tagRelation.get(arg,function(res){
				// console.log(res)
				
				if(res.status){
					tagRelationTail.data.tag_list=res.list.map(function(value){
						var id=value.id;
						if(!$scope.tagName[id]){
							$scope.searchTagNameTmp[id]=id;
						}
						return id;
					})
				}
				$scope.$apply();
			});
		})
		
	},1)
	
	
}])
