<?php
class TagRelation{
	public static function getList($arg){
		$where_str="";
		$where=[];
		// if(isset($arg['name']) && $arg['name']!=""){
			// $tag_data=TagName::getList(['name'=>$arg['name']]);
			// if($tag_data['status']){
				// $where[]="child_id in (".implode(",",array_column($tag_data['list'],"id")).") ";
			// }else{
				// $where[]="child_id = false";
			// }
		// }
		
		
		if(isset($arg['names_to_ids']) && is_array($arg['names_to_ids'])){
			$tag_data=TagName::getList(['name'=>$arg['names_to_ids']]);
			$id_to_names_str="id in (false)";
			if($tag_data['status']){
				if(count($arg['names_to_ids'])==count($tag_data['list'])){
					$id_to_names_str="id in (".implode(",",array_column($tag_data['list'],"id")).")";
				}
			}
			$where[]=$id_to_names_str;
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
			
			if(isset($arg['tag_names']) && is_array($arg['tag_names'])){
				$count=count($arg['tag_names']);
				$count_list=[];
				$list=[];
				foreach($tmp as $val){
					if(empty($count_list[$val['child_id']])){
						$count_list[$val['child_id']]=1;
					}else{
						$count_list[$val['child_id']]++;
					}
				}
				foreach($count_list as $child_id=>$count_item){
					if($count==$count_item){
						$list[]=$child_id;
					}
				}
				if(count($list)){
					$status=true;
				}
			}else{
				$status=true;
				$list=$tmp;
			}
		}else{
			$status=false;
		}
		
		return compact(['status','list','sql','bind_data']);
	}
	public static function insert($arg){
		
		if(isset($arg['id'])){
			$id=$arg['id'];
		}else if(isset($arg['name_to_id'])){
			$tag_data=TagName::insert($arg['name_to_id']);
			$id=$tag_data['id'];
		}else{
			return [];
		}
		
		if(isset($arg['child_id'])){
			$child_id=$arg['child_id'];
		}else if(isset($arg['name_to_child_id'])){
			$tag_data=TagName::insert($arg['name_to_id']);
			$child_id=$tag_data['id'];
		}else{
			return [];
		}
		
		if(isset($arg['level_id'])){
			$level_id=$arg['level_id'];
		}else{
			return [];
		}
		
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