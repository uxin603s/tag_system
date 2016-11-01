angular.module('app').component("webList",{
	bindings:{},
	templateUrl:'app/components/webList/webList.html?t='+Date.now(),
	controller:["$scope","cache","tagName",function($scope,cache,tagName){
		$scope.cache=cache;
		$scope.cache.webList || ($scope.cache.webList={});
		$scope.get=function(){
			var post_data={
				func_name:'WebList::getList',
				arg:{}
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					$scope.cache.webList.list=res.list;
				}else{
					$scope.cache.webList.list=[];
				}
				$scope.$apply();
			},"json")
		}
		$scope.add=function(webList){
			var post_data={
				func_name:'WebList::insert',
				arg:{
					name:webList.name,
				}
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					$scope.cache.webList.list.push(res.insert);
					webList.name='';
					$scope.$apply();
				}
				
			},"json")
		}
		$scope.del=function(index){
			if(!confirm("確認刪除?"))return;
			var post_data={
				func_name:'WebList::delete',
				arg:{
					id:$scope.cache.webList.list[index].id,
				}
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					$scope.cache.webList.list.splice(index,1);
					$scope.$apply();
				}
			},"json")
		}
		$scope.get();
		
		
		
		$scope.add_search=function(name){
			$scope.cache.search || ($scope.cache.search={});
			$scope.cache.search.list || ($scope.cache.search.list=[]);
			if($scope.cache.search.list.indexOf(name)==-1){
				$scope.cache.search.list.push(name);
			}
		}
		$scope.del_search=function(index){
			$scope.cache.search.list.splice(index,1);
		}
		var search_last_level=function(where_list){
			return new Promise(function(resolve,reject){
				var post_data={
					func_name:'TagRelation::getList',
					arg:{
						where_list:where_list,
					},
				}
				$.post("ajax.php",post_data,function(res){
					if(res.status){
						resolve(res.list);
					}else{
						reject("沒有任何關聯")
					}
					$scope.$apply();
				},"json");
			});
		}
		var AliasList_getList=function(where_list){
			return new Promise(function(resolve,reject){
				var post_data={
					func_name:'AliasList::getList',
					arg:{
						where_list:where_list
					}
				}
				$.post("ajax.php",post_data,function(res){
					var list=[];
					if(res.status){
						list=res.list
					}
					resolve && resolve(list);
				},"json")
			})
		}
		$scope.$watch("cache.search.list",function(value){
			if(!value)return;
			if(!value.length)return;
			
			tagName.nameToId(value,1)
			.then(function(ids){
				if($scope.cache.search.list.length==ids.length){
					var where_list=[
						{field:'level_id',type:0,value:$scope.cache.levelList[$scope.cache.levelList.length-1].data.id},
					];
					for(var i in ids){
						where_list.push({field:'id',type:0,value:ids[i]});
					}
					return search_last_level(where_list);
				}else{
					return Promise.reject("標籤有些不存在");
				}
			})
			.then(function(list){
				var count=$scope.cache.search.list.length;
				var child_id_result={};
				
				for(var i in list){
					var data=list[i];
					var child_id=data.child_id;
					var id=data.id;
					child_id_result[child_id] || (child_id_result[child_id]=[])
					child_id_result[child_id].push(id)
				}
				var child_ids=[];
				for(var i in child_id_result){
					if(child_id_result[i].length==count){//擁有搜尋標籤的id
						child_ids.push(i)
					}
				}
				if(child_ids.length){
					var where_list=[
						{field:'wid',type:0,value:$scope.cache.webList.select},
					];
					for(var i in child_ids){
						where_list.push({field:'id',type:0,value:child_ids[i]})
					}
					return AliasList_getList(where_list);//把id轉換成source_id
				}else{
					return Promise.reject("標籤沒有命中id");
				}
			})
			.then(function(list){
				var source_id_arr=list.map(function(value){
					return value.source_id;
				})
				console.log("搜尋到的原始id",source_id_arr)
			})
			.catch(function(message){
				console.log(message)
			})
		},1)
				
		var AliasList_insert=function(insert){
			return new Promise(function(resolve,reject){
				var post_data={
					func_name:'AliasList::insert',
					arg:insert,
				}
				$.post("ajax.php",post_data,function(res){
					resolve && resolve(res)
				},"json")
			})
		}
		var add_last_level=function(arg){
			return new Promise(function(resolve,reject){
				var post_data={
					func_name:'TagRelation::insert',
					arg:arg,
				}
				$.post("ajax.php",post_data,function(res){
					console.log(res);
				},"json");
			});
		}
		
		$scope.add_tag_relation=function(source_id,tag_name_list){
			var wid=$scope.cache.webList.select;
			if(!wid){
				alert("請選擇網站")
				return;
			}
			var where_list=[
				{field:'wid',type:0,value:$scope.cache.webList.select},
				{field:'source_id',type:0,value:source_id},
			];
			var child_id;
			AliasList_getList(where_list)
			.then(function(list){
				if(list.length){
					return list.pop();
				}else{
					return AliasList_insert({source_id:source_id,wid:wid})
				}
			})
			.then(function(item){
				child_id=item.id;
				return tagName.nameToId(tag_name_list,1);
			})
			.then(function(ids){
				var level_id=$scope.cache.levelList[$scope.cache.levelList.length-1].data.id
				for(var i in ids){
					add_last_level({
						id:ids[i],
						child_id:child_id,
						level_id:level_id,
					});
				}
			})
		}
		$scope.del_tag_relation=function(){
			
		}
		
	}],
})

