angular.module('app').component("index",{
	bindings:{},
	templateUrl:'app/components/index/index.html?t='+Date.now(),
	controller:['$scope','cache','idRelation',function($scope,cache,idRelation){
		$scope.cache=cache;
		
		postMessageHelper.receive("tagSystem",function(res){
			var getTag_timer=setInterval(function(){
				if(cache.webList && cache.webList.list[cache.webList.select] && cache.levelList){
					clearTimeout(getTag_timer);
					var wid=cache.webList.list[cache.webList.select].id
					var level_id=cache.levelList[cache.levelList.length-1].id;
					if(res.name=="getTag"){
						idRelation.get(res.value,wid,level_id)
						.then(function(res){
							var list=angular.copy(res);
							var result={};
							for(var i in list){
								result[i]=[];
								for(var j in list[i]){
									result[i].push(cache.tagName[list[i][j].id]);
								}
							}
							postMessageHelper.send("tagSystem",{name:"getTag",value:result})
						});
					}
					else if(res.name=="addTag"){
						idRelation.add(res.value.name,res.value.id,level_id,wid);
					}
					else if(res.name=="delTag"){
						// console.log(res.value)
						idRelation.del(res.value.index,res.value.id);
					}
				}
			},0)
			$scope.$apply();
		})
		var watch_selectList;
		$scope.$watch("cache.selectList",function(selectList){
			return
			if(!selectList)return;
			clearTimeout(watch_selectList)
			watch_selectList=setTimeout(function(){
				// console.log(selectList)
				var selectTag;
				for(var i in selectList){
					var data=selectList[i][selectList[i].length-1];
					
					if(data.select){
						selectTag=cache.tagName[data.select];
						delete data.select
						break;
					}
				}
				if(selectTag){
					postMessageHelper.send("tagSystem",{name:"selectTag",value:selectTag})
				}
				
			},0)
			
			
		},1)
	
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

