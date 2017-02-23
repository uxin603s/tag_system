<?php
class TagRelation{
	public static $table='tag_relation';
	public static $filter_field_arr=['id','level_id','child_id','sort_id'];
	use CRUD {
		CRUD::insert as tmp_insert;
	}
	public static function insert($arg){
		if($arg['tag_name']){
			$tmp=TagName::getList(['where_list'=>[['field'=>'name','type'=>0,'value'=>$arg['tag_name']]]]);
			if($tmp['status']){
				$arg['child_id']=$tmp['list'][0]['id'];
			}else{
				$tmp=TagName::insert(["name"=>$arg['tag_name']]);
				if($tmp['status']){
					$arg['child_id']=$tmp['insert']['id'];
				}
			}
			unset($arg['tag_name']);
		}
		
		return self::tmp_insert($arg);
	}
}