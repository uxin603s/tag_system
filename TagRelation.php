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
		$status=false;
		if(DB::delete($arg,"tag_relation")){
			$status=true;
			if(isset($arg['id'])){
				DB::query("update tag_relation_count set count=count-1 where id = ? && level_id = ?",[$arg['id'],$arg['level_id']]);
			}
		}
		return compact(['status']);
	}
	public static function sync($arg){
		$status=false;
		$bind_data=[$arg['level_id']];
		$sql="SELECT * FROM tag_level where id =?";
		if($tmp=DB::select($sql,$bind_data)){
			if($tmp[0]['sync_relation']){
				$bind_data=[$arg['level_id'],$arg['api_id']];
				$sql="select * from tag_api_level where level_id= ? && api_id=?";
				if($tmp=DB::select($sql,$bind_data)){
					$sort_id=$tmp[0]['sort_id']+1;
					$bind_data=[$arg['api_id'],$sort_id];
					$sql="select * from tag_api_level where api_id=? && sort_id =?";
					if($tmp=DB::select($sql,$bind_data)){
						$level_id_source=$arg['level_id'];
						$level_id_object=$tmp[0]['level_id'];
						$tmp=TagRelation::getList(['level_id'=>$level_id_source]);
						if($tmp['status']){
							$status=true;
							$id_arr=array_column($tmp['list'],"child_id");
							foreach($id_arr as $id){
								TagRelationCount::insert(['id'=>$id,'level_id'=>$level_id_object]);
							}
						}
					}
				}
			}
		}
		return compact(['status']);
	}
}