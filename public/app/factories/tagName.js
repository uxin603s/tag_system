angular.module('app').factory('tagName',[function(){
	var insert=function(name,callback){
		if(name==""){
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
				var result_ids=[];
				var result_names=[];
				if(res.status){
					for(var i in res.list){
						var data=res.list[i];
						result_ids.push(data.id);
						result_names.push(data.name);
					}
				}	
				
				if(return_type){//搜尋模式
					resolve && resolve(result_ids)
				}else{//新增模式
					if(where_list.length==1){
						insert(where_list[0].value,function(res){
							resolve && resolve(res.id)
						});
					}else{
						var insert_arr=[];
						if(where_list.length!=result_names.length){
							for(var i in where_list){
								if(result_names.indexOf(where_list[i].value)==-1){
									insert_arr.push(where_list[i].value)
								}
							}
						}
						for(var i in insert_arr){
							insert(insert_arr[i],function(res){
								result_ids.push(res.id);
								result_names.push(res.name);
								if(where_list.length==result_names.length){
									resolve && resolve(result_ids)
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
			getList(where_list,return_type)
			.then(resolve);
		})
	}
	return {
		insert:insert,
		getList:getList,
		nameToId:nameToId,
	}
}])