<?php
class TagLevel{
	public static $table='tag_level';
	public static $filter_field_arr=['id','tid','sort_id'];
	use CRUD {
		CRUD::delete as tmp_delete;
	}
	public static function flushCache(){
		$tmp=self::getList();
		$TagLevel=[];
		if($tmp['status']){
			foreach($tmp['list'] as $item){
				$TagLevel[$item['tid']][]=$item;
			}
		}
		Cache::run("TagLevel",$TagLevel);
	}
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
	public static function delete($arg){
		$where_list=[
			['field'=>'level_id','type'=>0,'value'=>$arg['id']],
		];
		$tmp=TagRelation::getList(['where_list'=>$where_list]);
		if(!$tmp['status']){
			return self::tmp_delete($arg);
		}
		$status=false;
		return compact(['status']);
	}
}