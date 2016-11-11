angular.module('app').component("index",{
	bindings:{},
	templateUrl:'app/components/index/index.html?t='+Date.now(),
	controller:['$scope','cache',function($scope,cache){
		$scope.cache=cache;
		$scope.cache.mode || ($scope.cache.mode={
			list:[
				{select:1,name:'階層編輯'},
				{select:2,name:'標籤搜尋'},
				{select:3,name:'關聯編輯'},
			],
			select:undefined,
		})
		
		$scope.cache.mode.width=window.innerWidth
		$scope.cache.mode.height=window.innerHeight;
		window.onresize = function(e) {
			$scope.cache.mode.width=window.innerWidth
			$scope.cache.mode.height=window.innerHeight;
			$scope.$apply();
		};
		var get_tree=function(levelIndex,ids){
			if(!cache.levelList[levelIndex])return
			var level_id=cache.levelList[levelIndex].id;
			
			var tree={};
			for(var i in ids){
				// console.log(cache.tagRelationList,level_id,id)
				var id=ids[i];
				tree[id]={};
				if(cache.tagRelationList[level_id] && cache.tagRelationList[level_id][id]){
					var child_ids=Object.keys(cache.tagRelationList[level_id][id]);
					// console.log(child_ids)
					// if(child_ids.length)
					tree[id]=get_tree(levelIndex+1,child_ids);
				}
				
			}
			return tree;
		}
		var watch_tree=function(){
			if(!cache.levelList)return;
			if(!cache.levelList[0])return;
			if(!cache.tagRelationList)return;
			if(!cache.tagRelationCountList)return;
			if(!Object.keys(cache.tagRelationList).length)return;
			if(!Object.keys(cache.tagRelationCountList).length)return;
			// cache.levelList
			clearTimeout($scope.watch_tree_timer)
			$scope.watch_tree_timer=setTimeout(function(){
				// console.log(cache.tagRelationCountList,cache.levelList[0])
				var ids=Object.keys(cache.tagRelationCountList[cache.levelList[0].id]);
				
				var tree=get_tree(0,ids);
				// console.log(tree)
			},500)
			
			
		}
		
		$scope.$watch("cache.levelList",watch_tree,1);
		$scope.$watch("cache.tagRelationList",watch_tree,1);
		$scope.$watch("cache.tagRelationCountList",watch_tree,1);
		
		
		var pmHelp=function(source,sendData,callback){
			if(!sendData.id)
				sendData.id=Date.now();
			
			// console.log(sendData);
			source.postMessage(sendData,"*")
			window.addEventListener("message",function(e){
				if(e.data.id==sendData.id){
					callback && callback(e.data)
				}
			},false)
		}
		
		
		
		window.addEventListener("message",function(e){
			
			if(e.data.status==0){
				// console.log(e.source)
				pmHelp(e.source,{status:1,type:'tagSystem',id:e.data.id,})
			}
			$scope.pm={
				source:e.source,
				id:e.data.id
			}
			watch_cache_tag_search();
			$scope.$apply()
		},false);
		
		var watch_cache_tag_search=function(){
			// console.log('cache.tag_search')
			if(!cache.tag_search)return
				
			// cache.tag_search || (cache.tag_search={})
			// cache.tag_search.result || (cache.tag_search.result=[])
			if($scope.pm){
				var data=cache.tag_search.result;
				pmHelp($scope.pm.source,{
					status:2,
					type:'tagSystem',
					data:data,
					id:$scope.pm.id,
				})
			}
		}
		$scope.$watch("cache.tag_search.result",watch_cache_tag_search,1)
		
		
		
	}],
})

