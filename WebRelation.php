<?php
class WebRelation{
	public static $table='web_relation';
	public static $filter_field_arr=['wid','source_id','tid','sort_id'];
	
	public static $cache_key_field=["wid","source_id","tid"];
	
	use CRUD{
		CRUD::insert as private tmp_insert;
	}
	public static function insert($arg){
		if($arg['tag_name']){
			$where_list=[
				['field'=>'name','type'=>0,'value'=>$arg['tag_name']]
			];
			$tmp=TagName::getList(compact(['where_list']));
			if($tmp['status']){
				$tagdata=$tmp['list'][0];
			}else{
				$tmp=TagName::insert(['name'=>$arg['tag_name']]);
				if($tmp['status']){
					$tagdata=$tmp['insert'];
				}
			}
			unset($arg['tag_name']);
			$arg['tid']=$tagdata['id'];
		}
		if($arg['tid']){
			return self::tmp_insert($arg);
		}else{
			$status=false;
			return compact(['status']);
		}
	}
}