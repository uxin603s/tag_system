<?php
class TagName{
	public static $filter_field=[
		'id','name',
	];
	public static function insert($arg){
		$name=$arg['name'];
		$created_time_int=time();
		$created_time=date("Y-m-d H:i:s",$created_time_int);
		$insert=compact(['name','created_time','created_time_int']);
		$id=DB::insert($insert,"tag_name");
		$insert['id']=$id;
		return $insert;
	}
	public static function getList($arg){
		$bind_data=[];
		$where_str=MysqlCompact::where($arg['where_list'],self::$filter_field,$bind_data);		
		$sql="select * from tag_name {$where_str}";
		if($tmp=DB::select($sql,$bind_data)){
			$list=$tmp;
			$status=true;
		}else{
			$status=false;
		}
		
		return compact(['status','list','sql','bind_data']);
	}
}