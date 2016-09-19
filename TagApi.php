<?php
class TagApi{
	public static function getList($arg){
		
		$status=false;
		if($tmp=DB::select("select * from tag_api where uid={$_SESSION['id']}")){
			$status=true;
			$list=$tmp;
		}
		return compact(['status','list']);
	}
	public static function insert($arg){
		//一個人在一個api只能開一個
		$insert=$arg;
		$status=false;
		if($id=DB::insert($insert,'tag_api')){
			$insert['id']=$id;
			$insert['uid']=$_SESSION['id'];
			$insert['status']=0;
			$status=true;
			$message="申請等待審核";
		}
		return compact(['status','message','insert']);
	}
	public static function update($arg){
		//欄位案權限 再過濾一次
		$update=$arg['update'];
		$where=$arg['where'];
		if(DB::update($update,$where,'tag_api')){
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
		if(DB::delete($where,'tag_api')){
			DB::delete($where,'tag_api_level');
			$status=true;
			$message="刪除成功";
		}else{
			$status=false;
			$message="刪除失敗";
		}
		return compact(['status','message']);
	}
}