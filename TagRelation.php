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
	public static function insert($insert){
		//需要檢查欄位
		
		$status=false;
		if($insert['child_id']!=$insert['id']){
			if(DB::insert($insert,"tag_relation")){
				$sql="select * from tag_relation_count where id = ? && level_id = ?";
				$bind_data=[$insert['id'],$insert['level_id']];
				if($tmp=DB::select($sql,$bind_data)){
					$sql="update tag_relation_count set count=count+1 where id = ? && level_id = ?";
					$result=DB::query($sql,$bind_data)->rowCount();
				}else{
					TagRelationCount::insert([
						'id'=>$insert['id'],
						'level_id'=>$insert['level_id'],
						'count'=>1,
					]);
				}
				$status=true;
			}
		}
		return compact(['insert','result','bind_data','status']);
	}
	public static function delete($delete){
		$auto_delete=$delete['auto_delete'];
		unset($delete['auto_delete']);
		$status=false;
		if(DB::delete($delete,"tag_relation")){
			$status=true;
			if(isset($delete['id'])){
				$bind_data=[$delete['id'],$delete['level_id']];
				$sql="update tag_relation_count set count=count-1 where id = ? && level_id = ?";
				DB::query($sql,$bind_data);
				if($auto_delete){
					$tmp=TagRelationCount::delete([
						'id'=>$delete['id'],
						'level_id'=>$delete['level_id'],
					]);
				}
			}
		}
		return compact(['status','delete']);
	}
	
}