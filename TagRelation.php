<?php
class TagRelation{
	public static $filter_field=['id','level_id','child_id','sort_id'];
	
	public static function getList($arg){
		$bind_data=[];
		$where_str=MysqlCompact::where($arg['where_list'],self::$filter_field,$bind_data);		
		$sql="select * from tag_relation {$where_str}
		order by sort_id 
		";
		if($tmp=DB::select($sql,$bind_data)){
			$status=true;
			$list=$tmp;
		}else{
			$status=false;
		}
		
		return compact(['status','list','sql','bind_data']);
	}
	public static function insert($insert){
		//需要檢查欄位
		
		$status=false;
		if(DB::insert($insert,"tag_relation")){
			$status=true;
		}
		
		return compact(['insert','result','bind_data','status']);
	}
	public static function delete($delete){
		
		$delete_flag=true;
		
		
		
		if($level_id=TagRelationLevel::get_level_id($delete['level_id'],1)){
			$sql="select * from tag_relation where level_id = {$level_id} && id = ?";
			$next=DB::select($sql,[$delete['child_id']]);
			$delete_flag = $delete_flag &&  !$next;
		}
		
		$status=false;
		if($delete_flag){
			if(DB::delete($delete,"tag_relation")){
				$status=true;
			}
		}
		return compact(['status','delete','prev','next']);
	}
	public static function update($arg){
		if(DB::update($arg['update'],$arg['where'],"tag_relation")){
			$status=true;
		}else{
			$status=false;
		}
		return compact(['status','arg']);
	}
}