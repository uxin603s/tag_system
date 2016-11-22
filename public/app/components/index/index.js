angular.module('app').component("index",{
	bindings:{},
	templateUrl:'app/components/index/index.html?t='+Date.now(),
	controller:['$scope','cache','idRelation',function($scope,cache,idRelation){
		$scope.cache=cache;
		
		postMessageHelper.receive("tagSystem",function(res){
			if(res.name=="getTag"){
				var getTag_timer=setInterval(function(){
					if(cache.webList && cache.webList.list[cache.webList.select] && cache.levelList){
						clearTimeout(getTag_timer);
						var wid=cache.webList.list[cache.webList.select].id
						var level_id=cache.levelList[cache.levelList.length-1].id;
						idRelation.get(res.value,wid,level_id)
						.then(function(res){
							var list=angular.copy(res);
							for(var i in list){
								for(var j in list[i]){
									list[i][j].name=cache.tagName[list[i][j].id]
									
								}
							}
							postMessageHelper.send("tagSystem",{name:"getTag",value:list})
						});
						
					}
				},0)
			}
			$scope.$apply();
		})
		
		// $scope.$watch("cache.webList.list",watch_receive)
		// $scope.$watch("cache.levelList",watch_receive)
	
		$scope.$watch("cache.tag_search.result",function(value){
			if(!value)return;
			postMessageHelper.send('tagSystem',{name:'search',value:value})
		})
		$scope.document=document.documentElement;
		window.onresize=function(){
			clearTimeout($scope.resizeTimer)
			$scope.resizeTimer=setTimeout(function(){
				cache.width=$scope.document.scrollWidth;
				cache.height=$scope.document.scrollHeight;
				// console.log(cache.width,cache.height)
				postMessageHelper.send('tagSystem',{
					name:'resize',
					value:{
						w:cache.width,
						h:cache.height,
					},
				})
				$scope.$apply();
			},0)
		}
		
		$scope.$watch("document.scrollWidth",window.onresize);
		$scope.$watch("document.scrollHeight",window.onresize);
		$scope.$watch("cache.editMode",window.onresize);
	}],
})

