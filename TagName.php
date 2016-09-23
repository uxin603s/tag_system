<?php
class TagName{
	public static function getTagIdTOName($arg){
		$tid_arr=$arg['tid_arr'];
		if(is_numeric(implode("",$tid_arr))){
			$list=DB::select("select * from tag_name where id in (".implode(",",$tid_arr).")");
			$status=true;
		}else{
			$status=false;
		}
		return compact(['status','list']);
	}
	public static function insert($name){
		
		$created_time_int=time();
		$created_time=date("Y-m-d H:i:s",$created_time_int);
		if($tmp=DB::select("select * from tag_name where name like ?",[$name])){
			$list=$tmp[0];
		}else{
			$insert=compact(['name','created_time','created_time_int']);
			$id=DB::insert($insert,"tag_name");
			$insert['id']=$id;
			$list=$insert;
		}
		return $list;
	}
	
	public static function getList($arg){
		if(isset($arg['name'])){
			$where_str="";
			$where=[];
			$bind_data=[];
			if(is_array($arg['name'])){
				$names=$arg['name'];
			}else{
				$names=[$arg['name']];
			}
			foreach($names as $name){
				$where[]=" name like ? ";
				$bind_data[]=$name;
			}
			if(count($where)){
				$where_str.="where ".implode(" || ",$where);
			}
			$sql="select * from tag_name {$where_str}";
			if($tmp=DB::select($sql,$bind_data)){
				$list=$tmp;
				$status=true;
			}else{
				$status=false;
			}
		}
		return compact(['status','list','sql','bind_data']);
	}
	
}