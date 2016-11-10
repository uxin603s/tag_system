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
		
	}],
})