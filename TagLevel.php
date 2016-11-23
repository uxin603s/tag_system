<?php
class TagLevel{
	public static function get_level_id($id,$updown){
		if($tmp=DB::select("select * from tag_level where id = ?",[$id])){
			$sort_id=$tmp[0]['sort_id']+$updown;
			$tid=$tmp[0]['tid'];
			
			if($tmp=DB::select("select * from tag_level where sort_id ={$sort_id} && tid = {$tid}")){
				return $tmp[0]['id'];
			}
		}
		return false;
	}
	public static function getList($arg){
		$tid=$arg['tid'];		
		if($tmp=DB::select("select * from tag_level where tid = ? order by sort_id asc",[$tid])){
			$status=true;
			$list=$tmp;
		}else{
			$status=false;
		}
		return compact(['status','list']);
	}
	
	public static function insert($insert){
		
		if($id=DB::insert($insert,'tag_level')){
			$insert['id']=$id;
			$status=true;
		}else{
			$status=false;
		}
		
		return compact(['status','insert']);
	}
	
	public static function update($arg){
		//欄位案權限 再過濾一次
		$update=$arg['update'];
		$where=$arg['where'];
		if(DB::update($arg['update'],$arg['where'],'tag_level')){
			$status=true;
			$message="修改成功";
		}else{
			$status=false;
			$message="修改失敗";
		}
		return compact(['status','message']);
	}
	public static function delete($where){
		if($tmp=self::getList(['tid'=>$where['tid']])){
			if($tmp['status']){
				$last_data=array_pop($tmp['list']);
			
				if($where['id']!=$last_data['id']){
					$status=false;
					$message="不是最後一層 無法刪除";
				}else if(DB::select("select * from tag_relation where level_id = ?",[$where['id']])){
					$status=false;
					$message="tag_relation 有資料 無法刪除";
				}else if(DB::delete($where,'tag_level')){
					$status=true;
					$message="刪除成功";
				}else{
					$status=false;
					$message="刪除失敗";
				}	
			}
		}
		return compact(['status','message','tmp']);
	}
}