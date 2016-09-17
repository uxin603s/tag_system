<?php
class TagLevel{
	public static function getList($arg){
		$api_id=$arg['api_id'];		
		if($tmp=DB::select("select * from tag_api_level where api_id = ? order by sort_id asc",[$api_id])){
			$level_id_arr=array_column($tmp,"level_id");
			$sort_id_arr=array_column($tmp,"sort_id","level_id");
			if($tmp=DB::select("select * from tag_level where id in (".implode(",",$level_id_arr).") ")){
				$status=true;
				$list=$tmp;
				foreach($list as $key=>$val){
					$list[$key]['sort_id']=$sort_id_arr[$val['id']];
				}
				usort($list,function($a,$b){
					return $a['sort_id']-$b['sort_id'];
				});
			}else{
				$status=false;
			}
		}else{
			$status=false;
		}
		
		return compact(['status','list']);
	}
	public static function insert($arg){
		$insert=[];
		if($id=DB::insert($insert,'tag_level')){
			$TagApiLevel_message=TagApiLevel::addRelation(['api_id'=>$arg['api_id'],'level_id'=>$id]);
			$insert['id']=$id;
			$insert['sort_id']=0;
			$status=true;
		}else{
			$status=false;
		}
		return compact(['status','insert','TagApiLevel_message']);
	}
	public static function update($arg){
		//欄位案權限 再過濾一次
		$update=$arg['update'];
		$where=$arg['where'];
		if(DB::update($update,$where,'tag_level')){
			$status=true;
			$message="修改成功";
		}else{
			$status=false;
			$message="修改失敗";
		}
		return compact(['status','message']);
	}
	public static function delete($arg){
		$where=[];
		$where['id']=$arg['level_id'];
		
		if(DB::delete($where,'tag_level')){
			$TagApiLevel_message=TagApiLevel::delRelation(['api_id'=>$arg['api_id'],'level_id'=>$arg['level_id']]);
			TagRelationCount::delete(['level_id'=>$arg['level_id']]);
			TagRelation::delete(['level_id'=>$arg['level_id']]);
			$status=true;
			$message="刪除成功";
		}else{
			$status=false;
			$message="刪除失敗";
		}
		return compact(['status','message','TagApiLevel_message']);
		
	}
}