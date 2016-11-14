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
		
		
		
		
		
		window.onresize = function(e) {
			
			clearTimeout($scope.resizeTimer)
			$scope.resizeTimer=setTimeout(function(){
				var w=document.documentElement.scrollWidth;
				var h=document.documentElement.scrollHeight;
				postMessageHelper.slave('tagSystem-resize',{
					w:w,
					h:h,
				})
				$scope.cache.mode.width=w;
				$scope.cache.mode.height=h;
			},500)
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
		
		$scope.$watch("cache.tag_search.result",function(value){
			if(!value)return;
			postMessageHelper.slave('tagSystem-search',value)
		})
		$scope.document=document.documentElement;
		var watchWH=function(value){
			
			clearTimeout($scope.resizeTimer)
			$scope.resizeTimer=setTimeout(function(){
				var w=document.documentElement.scrollWidth;
				var h=document.documentElement.scrollHeight;
				postMessageHelper.slave('tagSystem-resize',{
					w:w,
					h:h,
				})
				$scope.cache.mode.width=w;
				$scope.cache.mode.height=h;
			},50)
			
		}
		$scope.$watch("document.scrollHeight",watchWH)
		$scope.$watch("document.scrollWidth",watchWH)
		
		
	}],
})

