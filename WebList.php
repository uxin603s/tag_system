<?php
class WebList{
	public static $filter_field=['id','name'];
	public static function getList($arg){
		$bind_data=[];
		$where_str=MysqlCompact::where($arg['where_list'],self::$filter_field,$bind_data);		
		$sql="select * from web_list {$where_str} ";
		
		if($tmp=DB::select($sql,$bind_data)){
			$status=true;
			$list=$tmp;
		}else{
			$status=false;
		}
		return compact(['status','list','sql']);
	}
	public static function insert($insert){
		if($id=DB::insert($insert,'web_list')){
			$insert['id']=$id;
			$status=true;
			$message="新增成功";
		}else{
			$status=false;
			$message="新增失敗";
		}
		return compact(['status','message','insert']);
	}
	public static function update($arg){
		
	}
	public static function delete($where){
		
		if(DB::select("select * from alias_list where wid = ? ",[$where['id']])){
			$status=false;
			$message="alias_list 有資料無法刪除";
		}else if(DB::delete($where,'web_list')){
			$status=true;
			$message="刪除成功";
		}else{
			$status=false;
			$message="刪除失敗";
		}
		return compact(['status','message']);
	}

}