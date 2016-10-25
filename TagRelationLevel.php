<?php
class TagRelationLevel{
	public static function getList($arg){
		$tid=$arg['tid'];		
		if($tmp=DB::select("select * from tag_relation_level where tid = ? order by sort_id asc",[$tid])){
			$status=true;
			$list=$tmp;
		}else{
			$status=false;
		}
		return compact(['status','list']);
	}
	
	public static function insert($arg){
		$insert=$arg;
		if($id=DB::insert($insert,'tag_relation_level')){
			$insert['id']=$id;
			$insert['sort_id']=0;
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
		if(DB::update($arg['update'],$arg['where'],'tag_relation_level')){
			$status=true;
			$message="修改成功";
		}else{
			$status=false;
			$message="修改失敗";
		}
		return compact(['status','message']);
	}
	public static function delete($arg){
		$where=$arg;
		$tmp=TagRelationCount::getList(['level_id'=>$arg['id']]);
		if(!$tmp['status'] && DB::delete($where,'tag_relation_level')){
			$status=true;
			$message="刪除成功";
		}else{
			$status=false;
			$message="刪除失敗";
		}
		return compact(['status','message','tmp']);
		
	}
}