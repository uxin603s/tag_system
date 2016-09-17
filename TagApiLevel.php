<?php
class TagApiLevel{
	public static function update_sort_id($arg){
		$update=[];
		$where=[];
		$update['sort_id']=$arg['sort_id'];
		$where['api_id']=$arg['api_id'];
		$where['level_id']=$arg['level_id'];
		if(DB::update($update,$where,"tag_api_level")){
			$status=true;
		}else{
			$status=false;
		}
		return compact(['status']);
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