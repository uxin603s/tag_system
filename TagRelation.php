<?php
class TagRelation{
	public static $filter_field=['id','level_id','child_id'];
	public static function getList($arg){
		$bind_data=[];
		$where_str=MysqlCompact::where($arg['where_list'],self::$filter_field,$bind_data);		
		$sql="select * from tag_relation {$where_str}";
		if($tmp=DB::select($sql,$bind_data)){
			$status=true;
			$list=$tmp;
		}else{
			$status=false;
		}
		
		return compact(['status','list','sql','bind_data']);
	}
	public static function insert($arg){
		//需要檢查欄位
		$insert=[];
		$insert['id']=$arg['id'];
		$insert['child_id']=$arg['child_id'];
		$insert['level_id']=$arg['level_id'];
		$status=false;
		if($arg['child_id']!=$arg['id']){
			if(DB::insert($insert,"tag_relation")){
				$sql="update tag_relation_count set count=count+1 where id = ? && level_id = ?";
				$bind_data=[$arg['id'],$arg['level_id']];
				$result=DB::query($sql,$bind_data)->rowCount();
				$status=true;
			}
		}
		return compact(['insert','result','bind_data','status']);
	}
	public static function delete($arg){
		$status=false;
		if(DB::delete($arg,"tag_relation")){
			$status=true;
			if(isset($arg['id'])){
				DB::query("update tag_relation_count set count=count-1 where id = ? && level_id = ?",[$arg['id'],$arg['level_id']]);
			}
		}
		return compact(['status']);
	}
	
}