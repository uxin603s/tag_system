<?php
class TagApiLevel{
	public static function update($arg){
		//欄位案權限 再過濾一次
		$update=$arg['update'];
		$where=$arg['where'];
		if(DB::update($arg['update'],$arg['where'],'tag_api_level')){
			$status=true;
			$message="修改成功";
		}else{
			$status=false;
			$message="修改失敗";
		}
		return compact(['status','message']);
	}
	public static function addRelation($arg){
		$bind_data=[$arg['api_id'],$arg['level_id']];
		$sql="select * from tag_api_level where api_id = ? && level_id = ?";
		if(DB::select($sql,$bind_data)){
			$message="關聯存在，不需建立";
		}else{
			$insert=$arg;
			$message="關聯不存在";
			if(DB::insert($insert,"tag_api_level")){
				$message.="，建立關聯成功";
			}else{
				$message.="，建立關聯失敗";
			}
		}
		return $message;
	}
	public static function delRelation($arg){
		$bind_data=[$arg['api_id'],$arg['level_id']];
		$sql="select * from tag_api_level where api_id = ? && level_id = ?";
		if(DB::select($sql,$bind_data)){
			$message="關聯存在，";
			if(DB::delete($arg,"tag_api_level")){
				$message.="，刪除關聯成功";
			}else{
				$message.="，刪除關聯失敗";
			}
		}else{
			
			$message="關聯不存在，不需刪除";
			
		}
		return $message;
	}
}