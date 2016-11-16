angular.module('app').component("index",{
	bindings:{},
	templateUrl:'app/components/index/index.html?t='+Date.now(),
	controller:['$scope','cache',function($scope,cache){
		$scope.cache=cache;
		
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
			clearTimeout($scope.watch_tree_timer)
			$scope.watch_tree_timer=setTimeout(function(){
				var ids=Object.keys(cache.tagRelationCountList[cache.levelList[0].id]);
				var tree=get_tree(0,ids);
			},500)
		}
		
		$scope.$watch("cache.levelList",watch_tree,1);
		$scope.$watch("cache.tagRelationList",watch_tree,1);
		$scope.$watch("cache.tagRelationCountList",watch_tree,1);
		
		postMessageHelper.receive("tagSystem-search")
		postMessageHelper.receive("tagSystem-resize")
		$scope.$watch("cache.tag_search.result",function(value){
			if(!value)return;
			postMessageHelper.send('tagSystem-search',value)
		})
		$scope.document=document.documentElement;
		window.onresize=function(){
			clearTimeout($scope.resizeTimer)
			$scope.resizeTimer=setTimeout(function(){
				cache.width=$scope.document.scrollWidth;
				cache.height=$scope.document.scrollHeight;
				postMessageHelper.send('tagSystem-resize',{
					w:cache.width,
					h:cache.height,
				})
				// console.log(cache.height);
				$scope.$apply();
			},50)
		}
		$scope.$watch("document.scrollWidth",window.onresize);
		$scope.$watch("document.scrollHeight",window.onresize);
		$scope.$watch("cache.editMode",window.onresize);
		
	}],
})

