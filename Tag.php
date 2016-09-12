<?php
class Tag{
	public static function insert($name){
		if(is_array($name)){
			$name_array=$name;
		}else{
			$name_array=[$name];
		}
		
		$list=[];
		foreach($name_array as $name){
			$created_time_int=time();
			$created_time=date("Y-m-d H:i:s",$created_time_int);
			if($tmp=DB::select("select * from tag_name where name like ?",[$name])){
				$list[]=$tmp[0];
			}else{
				$insert=compact(['name','created_time','created_time_int']);
				$id=DB::insert($insert,"tag_name");
				$list[]=array_merge($insert,['id'=>$id]);
			}
		}
		return compact(['list']);
	}
	
	public static function getList($name){
		$status=false;
		if($tmp=DB::select("select * from tag_name where name like ?",["%".$name."%"])){
			$list=$tmp;
			$status=true;
		}
		return compact(['status','list']);
	}
	
}