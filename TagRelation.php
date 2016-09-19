<?php
class TagRelation{
	public static function getList($arg){
		$where_str="";
		$where=[];
		if(isset($arg['name']) && $arg['name']!=""){
			$tag_data=Tag::getList($arg['name']);
			if($tag_data['status']){
				$where[]="child_id in (".implode(",",array_column($tag_data['list'],"id")).") ";
			}else{
				$where[]="child_id = false";
			}
		}
		if(isset($arg['level_id'])){
			$where[]="level_id = ?";
			$bind_data[]=$arg['level_id'];
		}
		if(isset($arg['id'])){
			$where[]="id = ?";
			$bind_data[]=$arg['id'];
		}
		if(count($where)){
			$where_str.=" where ";
			$where_str.=implode(" && ",$where);
		}
		$sql="select * from tag_relation {$where_str}";
		if($tmp=DB::select($sql,$bind_data)){
			$status=true;
			$list=$tmp;
		}else{
			$status=false;
		}
		return compact(['status','list','sql',]);
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