<?php
class TagType{
	public static $white_field=["id","name","comment"];
	public static function filter_field($array){
		$data=[];
		foreach(self::$white_field as $field){
			if(isset($array[$field])){
				$data[$field]=$array[$field];
			}
		}
		return $data;
	}
	public static function getList($arg){
		$status=false;
		if($tmp=DB::select("select * from tag_type ")){
			$status=true;
			$list=$tmp;
		}
		return compact(['status','list']);
	}
	public static function insert($insert){
		if($id=DB::insert($insert,'tag_type')){
			$insert['id']=$id;
			$status=true;
			$message="新增成功";
		}else{
			$status=false;
			$message="新增失敗";
		}
		return compact(['status','message','insert']);
	}
	
	public static function update($arg){
		//欄位案權限 再過濾一次
		$update=self::filter_field($arg['update']);
		$where=self::filter_field($arg['where']);
		
		if(DB::update($update,$where,'tag_type')){
			$status=true;
			$message="修改成功";
		}else{
			$status=false;
			$message="修改失敗";
		}
		return compact(['status','message']);
	}
	
	public static function delete($where){
		
		if(DB::select("select * from tag_relation_level where tid = ? ",[$where['id']])){
			$status=false;
			$message="tag_relation_level 有資料無法刪除";
		}else if(DB::delete($where,'tag_type')){
			$status=true;
			$message="刪除成功";
		}else{
			$status=false;
			$message="刪除失敗";
		}
		return compact(['status','message']);
	}
}