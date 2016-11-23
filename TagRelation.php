<?php
class TagRelation{
	public static $filter_field=['id','level_id','child_id','sort_id'];
	public static function getIntersection($arg){
		if(empty($arg['require_id'])){
			$arg['require_id']=[];
		}
		$bind_data=$arg['require_id'];
		
		if(isset($arg['option_id'])){
			$bind_data=array_merge($bind_data,$arg['option_id']);
		}
		$require_id_count=count($arg['require_id']);
		$where_in=implode(",",array_fill(0,count($bind_data),"?"));
	 
		$sql="
			SELECT child_id 
			FROM `tag_relation`
			WHERE `id` in ({$where_in}) 
			group by child_id
			having 
				count(id)  >=  {$require_id_count}  
		";
		foreach($arg['require_id'] as $id){
			$sql.=" && max( CASE `id`  WHEN ? THEN 1 ELSE 0 END ) = 1 ";
			$bind_data[]=$id;
		}
		
		if($tmp=DB::select($sql,$bind_data)){
			$status=true;
			$list=$tmp;
		}else{
			$status=false;
		}
		return compact(['status','list','sql','bind_data','arg']);
	}
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