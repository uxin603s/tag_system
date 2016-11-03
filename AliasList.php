<?php
class AliasList{
	public static $filter_field=[
		'id','source_id','wid',
	];
	public static function getList($arg){
		$bind_data=[];
		$where_str=MysqlCompact::where($arg['where_list'],self::$filter_field,$bind_data);		
		$sql="select * from alias_list {$where_str}";
		if($tmp=DB::select($sql,$bind_data)){
			$list=$tmp;
			$status=true;
		}else{
			$status=false;
		}
		
		return compact(['status','list','sql','bind_data']);
	}
	public static function insert($insert){
		
		$insert['id']=DB::insert($insert,"alias_list");
		return $insert;
	}
}