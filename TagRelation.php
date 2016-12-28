<?php
class TagRelation{
	public static $table='tag_relation';
	public static $filter_field_arr=['id','level_id','child_id','sort_id'];
	use CRUD;
	public static function flushCache(){
		$tmp=self::getList();
		$TagRelation=[];
		if($tmp['status']){
			foreach($tmp['list'] as $item){
				$TagRelation[$item['level_id']][$item['id']][]=$item['child_id'];
			}
		}
		Cache::run("TagRelation",$TagRelation);
	}
}