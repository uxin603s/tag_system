<?php
class WebRelation{
	public static $filter_field=['wid','source_id','tid','sort_id'];

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
		$bind_data[]=$arg['wid'];
		$sql="
			SELECT source_id 
			FROM `web_relation`
			WHERE `tid` in ({$where_in}) 
			&&
			wid =?
			group by source_id
			having 
				count(tid)  >=  {$require_id_count}  
		";
		foreach($arg['require_id'] as $id){
			$sql.=" && max( CASE `tid`  WHEN ? THEN 1 ELSE 0 END ) = 1 ";
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
		$sql="select * from web_relation {$where_str}
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
		if(DB::insert($insert,"web_relation")){
			$status=true;
		}
		
		return compact(['insert','status']);
	}
	public static function delete($delete){
		$status=false;
		if(DB::delete($delete,"web_relation")){
			$status=true;
		}
		
		return compact(['status','delete','prev','next']);
	}
	public static function update($arg){
		if(DB::update($arg['update'],$arg['where'],"web_relation")){
			$status=true;
		}else{
			$status=false;
		}
		return compact(['status','arg']);
	}
}