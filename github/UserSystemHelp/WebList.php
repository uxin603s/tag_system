<?php
class WebList{
	public static function getList(){
		$list=[];
		$status=true;
		if(in_array(0,$_SESSION['rid'])){
			$list=$_SESSION['web'][0];
		}else{
			foreach($_SESSION['web'] as $data){
				foreach($data as $wid=>$value){
					$list[$wid]=$value;
				}
			}
			$list=array_values($list);
		}
		return compact(["status","list"]);
	}
}
