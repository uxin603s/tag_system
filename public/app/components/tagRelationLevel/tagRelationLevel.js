angular.module('app').component("tagRelationLevel",{
	bindings:{},
	templateUrl:'app/components/tagRelationLevel/tagRelationLevel.html?t='+Date.now(),
	controller:["$scope","cache","tagRelationCount","tagName",function($scope,cache,tagRelationCount,tagName){
		$scope.cache=cache;
		cache.count || (cache.count={})
		cache.relation || (cache.relation={})
		cache.selectList=[
			[]
		];
		$scope.get=function(){
			var post_data={
				func_name:'TagRelationLevel::getList',
				arg:{
					tid:cache.tagType.list[cache.tagType.select].id,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					cache.levelList=res.list;
					for(var i in res.list){
						cache.count[res.list[i].id]={};
						cache.relation[res.list[i].id]={};
					}
				}else{
					cache.levelList=[];
					cache.count={};
					cache.relation={};
				}
				$scope.$apply();
			},"json")
		}
		$scope.get();
		$scope.add=function(){
			var post_data={
				func_name:'TagRelationLevel::insert',
				arg:{
					tid:cache.tagType.list[cache.tagType.select].id,
					sort_id:cache.levelList.length || 0,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					cache.levelList.push(res.insert);
				}
				$scope.$apply();
			},"json")
		}
		$scope.del=function(index){
			if(!confirm("確認刪除?")){
				return;
			}
			var post_data={
				func_name:'TagRelationLevel::delete',
				arg:{
					id:cache.levelList[index].id,
					tid:cache.tagType.list[cache.tagType.select].id,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					cache.levelList.splice(index,1);
					$scope.$apply();
				}
			},"json")
		}
		// var watch_levelList=function(){
			// if(!cache.levelList)return;
			// var tree=[];
			// for(var i in cache.levelList){
				// tree.push({list:[],select:undefined});
			// }
			
			
			// if(cache.tagType.list[cache.tagType.select].lock_lv1){
				// var compare=function(a,b){
					// return angular.copy(JSON.stringify(a))==angular.copy(JSON.stringify(b));
				// }
				// tagRelationCount.get([
					// {field:'level_id',type:0,value:cache.levelList[0].id},
				// ])
				// .then(function(res){
					// var treeData=[];
					// if(res.status){
						// var list=res.list;
						// for(var i in list){
							// tree[0].list=list;
							// tree[0].select=list[i].id;
							// tree[0].count=list[i].count;
							// treeData.push(angular.copy(tree));
						// }
						// if(cache.treeData){
							// if(treeData.length!=cache.treeData.length){
								// cache.treeData=treeData;
							// }else{
								// for(var i in treeData){
									// if(compare(treeData[i][0],cache.treeData[i][0])){
										// cache.treeData[i][0]=treeData[i][0];
									// }
								// }
							// }
						// }else{
							// cache.treeData=treeData;
						// }
						// tagName.idToName(list.map(function(val){return val.id}));
						// $scope.$apply();
					// }
					
				// })
			// }else{
				// var treeData=[];
				// treeData.push(angular.copy(tree));
				// if(cache.treeData){

					// if(treeData[0].length!=cache.treeData[0].length){
						// cache.treeData=treeData;
					// }
					// if(treeData.length!=cache.treeData.length){
						// cache.treeData=treeData;
					// }
				// }else{
					// cache.treeData=treeData;
				// }
				
			// }
			
		// }
		// $scope.$watch("cache.levelList",function(val){
			// if(!val)return;
			// watch_levelList();
		// },1)
		// $scope.$watch("cache.tagType.select",function(){
			// $scope.watch_lock_lv1 && $scope.watch_lock_lv1();
			
			// if(!cache.tagType.list[cache.tagType.select])return;
			// $scope.watch_lock_lv1=$scope.$watch("cache.tagType.list["+cache.tagType.select+"].lock_lv1",watch_levelList);
			// $scope.get();
		// });
		
		// $scope.$watch("cache.treeData",function(treeData){
			// if(!$scope.cache.tag_search)return;
			// clearTimeout($scope.watch_treeDataTimer);
			// $scope.watch_treeDataTimer=setTimeout(function(){
				// $scope.cache.tag_search.clickSearch=[];
				// for(var i in treeData){
					// var tree=angular.copy(treeData[i]);
					// var last=tree.length-1;
					// var select=tree[last].select;
					// if(select){
						// var name=$scope.cache.tagName[select];
						// var index=$scope.cache.tag_search.clickSearch.findIndex(function(val){
							// return val.name==name;
						// })
						// if(index==-1)
							// $scope.cache.tag_search.clickSearch.push({name:name});
					// }else{
						// var list=tree[last].list;
						
						// if(list.length){
							// for(var j in list){
								// var id=list[j].id;
								// var name=$scope.cache.tagName[id];
								// var index=$scope.cache.tag_search.clickSearch.findIndex(function(val){
									// return val.name==name;
								// })
								// if(index==-1)
									// $scope.cache.tag_search.clickSearch.push({name:name,type:1});
							// }
						// }else{
							// var select=tree[last-1].select;
							// if(select){
								// var name=$scope.cache.tagName[select];
								// var index=$scope.cache.tag_search.clickSearch.findIndex(function(val){
									// return val.name==name;
								// })
								// if(index==-1)
									// $scope.cache.tag_search.clickSearch.push({name:name});
							// }
						// }
					// }
				// }
				// $scope.$apply();
			// },500)
		// },1)
	}]
});