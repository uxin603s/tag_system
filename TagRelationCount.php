<?php
class TagRelationCount{
	public static function getList($arg){
		$level_id=$arg['level_id'];
		if($tmp=DB::select("select * from tag_relation_count where level_id = ? order by count desc",[$level_id])){
			$status=true;
			$list=$tmp;
		}else{
			$status=false;
		}
		return compact(['status','list']);
	}
	public static function insert($arg){
		$tag_data=Tag::insert($arg['name']);
		
		$id=$tag_data['id'];
		$level_id=$arg['level_id'];
		$count=0;
		$insert=compact(['id','level_id','count']);
		DB::insert($insert,"tag_relation_count");
		return compact(['insert']);
	}
	public static function delete($arg){
		$level_id=$arg['level_id'];
		$where=compact(['level_id']);
		DB::delete($where,"tag_relation_count");
	}
}