angular.module('app').factory('tagName',[function(){
	var insert=function(name,callback){
		if(name==""){
			alert("標籤不能空白")
			return;
		}
		if(typeof name =="string"){
			var insert={
				name:name,
				
			}
		}else{
			var insert=[];
			for(var i in name){
				insert.push({
					name:name[i],
				})
			}
		}
		var post_data={
			func_name:'TagName::insert',
			arg:insert,
		}
		
		$.post("ajax.php",post_data,function(res){
			callback && callback(res)
		},"json")
	};
	var getList=function(name,return_type,callback){
		var where_list=[];
		
		if(typeof name =="string"){
			where_list.push({field:'name',type:0,value:name})
		}else{
			for(var i in name){
				where_list.push({field:'name',type:0,value:name[i]})
			}
		}
		
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
				callback && callback(result_ids)
			}else{//新增模式
				if(typeof name =="string"){
					insert(name,function(res){
						callback && callback(res.id)
					});
				}else{
					var insert_arr=[];
					if(name.length!=result_names.length){
						for(var i in name){
							if(result_names.indexOf(name[i])==-1){
								insert_arr.push(name[i])
							}
						}
					}
					for(var i in insert_arr){
						insert(insert_arr[i],function(res){
							result_ids.push(res.id);
							result_names.push(res.name);
							if(name.length==result_names.length){
								callback && callback(result_ids)
							}
						})
					}
				}
			}
		},"json")	
	}
	var nameToId=function(name,return_type){
		return new Promise(function(resolve,reject) {
			getList(name,return_type,resolve);
		})
	}
	return {
		insert:insert,
		getList:getList,
		nameToId:nameToId,
	}
}])