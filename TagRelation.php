<?php
class TagRelation{
	public static function getList($arg){
		$level_id=$arg['level_id'];
		$id=$arg['id'];
		if($tmp=DB::select("select * from tag_relation where level_id = ? && id =?",[$level_id,$id])){
			$status=true;
			$list=$tmp;
		}else{
			$status=false;
		}
		return compact(['status','list']);
	}
	public static function insert($arg){
		if($arg['name']!=""){
			$tag_data=Tag::insert($arg['name']);
			
			$child_id=$tag_data['id'];
			$id=$arg['id'];
			
			$level_id=$arg['level_id'];
			if($id!=$child_id){
				$insert=compact(['id','child_id','level_id']);
				if(DB::insert($insert,"tag_relation")){
					DB::query("update tag_relation_count set count=count+1 where id = ? && level_id = ?",[$id,$level_id]);
				}
			}
		}
		return compact(['insert']);
	}
	public static function delete($arg){
		if(DB::delete($arg,"tag_relation")){
			if(isset($arg['id'])){
				DB::query("update tag_relation_count set count=count-1 where id = ? && level_id = ?",[$arg['id'],$arg['level_id']]);
			}
		}
	}
}