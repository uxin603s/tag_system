angular.module('app').factory('tagName',[function(){
	var insert=function(name,callback){
		if(name===""){
			alert("標籤不能空白")
			return;
		}
		var post_data={
			func_name:'TagName::insert',
			arg:{
				name:name,
			},
		}
		
		$.post("ajax.php",post_data,function(res){
			callback && callback(res)
		},"json")
	};
	var getList=function(where_list,return_type){
		
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'TagName::getList',
				arg:{
					where_list:where_list,
				},
			}
			
			$.post("ajax.php",post_data,function(res){
				var result_names=[];
			
				if(res.status){
					var list=res.list;
					for(var i in list){
						var data=list[i];
						result_names.push(data.name);
					}
				}else{
					var list=[];
				}	
				
				if(return_type){//搜尋模式
					resolve && resolve(list)
				}else{//新增模式
					var insert_arr=[];
					if(where_list.length==list.length){
						resolve && resolve(list)
					}else{
						for(var i in where_list){
							if(result_names.indexOf(where_list[i].value)==-1){
								insert_arr.push(where_list[i].value)
							}
						}
						for(var i in insert_arr){
							insert(insert_arr[i],function(res){
								list.push(res)
								if(where_list.length==list.length){
									resolve && resolve(list)
								}
							})
						}
					}
				}
			},"json")	
		})
	}
	var nameToId=function(name,return_type){
		var where_list=[];
		
		if(typeof name =="string"){
			where_list.push({field:'name',type:2,value:name})
		}else{
			for(var i in name){
				where_list.push({field:'name',type:2,value:name[i]})
			}
		}
		return new Promise(function(resolve,reject) {
			getList(where_list,return_type).then(resolve);
		})
	}
	return {
		insert:insert,
		getList:getList,
		nameToId:nameToId,
	}
}])