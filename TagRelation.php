<?php
class TagRelation{
	public static function getList($arg){
		$where_str="";
		$where=[];
		if(isset($arg['name']) && $arg['name']!=""){
			$tag_data=TagName::getList($arg['name']);
			if($tag_data['status']){
				$where[]="child_id in (".implode(",",array_column($tag_data['list'],"id")).") ";
			}else{
				$where[]="child_id = false";
			}
		}
		if(isset($arg['child_id'])){
			$where[]="child_id = ?";
			$bind_data[]=$arg['child_id'];
		}
		if(isset($arg['level_id'])){
			$where[]="level_id = ?";
			$bind_data[]=$arg['level_id'];
		}
		if(isset($arg['id'])){
			$where[]="id = ?";
			$bind_data[]=$arg['id'];
		}
		if(isset($arg['ids']) && is_array($arg['ids'])){
			$where[]="id in (".implode(",",array_fill(0,count($arg['ids']),"?")).")";
			$bind_data=array_merge($bind_data,$arg['ids']);
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
		return compact(['status','list','sql','bind_data']);
	}
	public static function insert($arg){
		if(isset($arg['name'])){
			$tag_data=TagName::insert($arg['name']);
			$child_id=$tag_data['id'];
		}else if(isset($arg['child_id'])){
			$child_id=$arg['child_id'];
		}else{
			return [];
		}
		
		$id=$arg['id'];
		
		$level_id=$arg['level_id'];
		if($id!=$child_id){
			$insert=compact(['id','child_id','level_id']);
			if(DB::insert($insert,"tag_relation")){
				$bind_data=[$id,$level_id];
				$sql="update tag_relation_count set count=count+1 where id = ? && level_id = ?";
				$result=DB::query($sql,$bind_data);
			}
		}
		
		return compact(['insert','result','bind_data','sql']);
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