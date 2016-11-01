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
		
		$scope.AliasList_insert=function(source_id,wid,callback){
			var post_data={
				func_name:'AliasList::insert',
				arg:{
					source_id:source_id,
					wid:wid,
				},
			}
			$.post("ajax.php",post_data,function(res){
				callback && callback(res)
			},"json")
		}
		$scope.AliasList_getList=function(source_id,wid){
			return new Promise(function(resolve,reject){
				var post_data={
					func_name:'AliasList::getList',
					arg:{
						where_list:[
							{field:'source_id',type:0,value:source_id},
							{field:'wid',type:0,value:wid},
						]
					}
				}
				$.post("ajax.php",post_data,function(res){
					console.log(res)
					if(res.status){
						resolve && resolve(res.list.pop().id);
					}else{
						$scope.AliasList_insert(source_id,wid,function(res){
							resolve(res.id);
						})
					}
				},"json")
			})
		}
		
		$scope.add_tag_relation=function(source_id,tag_name_list){
			var wid=$scope.cache.webList.select;
			if(!wid){
				alert("請選擇網站")
				return;
			}
			$scope.AliasList_getList(source_id,wid).then(function(child_id){
				console.log(tag_name_list)
				return tagName.nameToId(tag_name_list);
			}).then(function(id){
				console.log(id)
				// var post_data={
					// func_name:'TagRelation::insert',
					// arg:{
						// level_id:$scope.cache.levelList[$scope.cache.levelList.length-1].data.id,
						// id:id,
						// child_id:child_id,
					// }
				// }
				// $.post("ajax.php",post_data,function(res){
					// console.log(res)
					
				// },"json")
			})
			
			
			// $scope.AliasList_getList(source_id,wid)
			// .then(alias_getlist)
			// .catch(function(source_id,wid){
				// return $scope.AliasList_getList(source_id,wid);
			// }).then(alias_getlist);
			
			
			
		}
		$scope.del_tag_relation=function(){
			
		}
		
	}],
})

