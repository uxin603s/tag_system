<?php
class TagName{
	public static $table='tag_name';
	public static $filter_field_arr=['id','name',];
	use CRUD;
	public static function flushCache(){
		$tmp=self::getList();
		$TagName=[];
		if($tmp['status']){
			foreach($tmp['list'] as $item){
				$TagName[$item['id']]=$item['name'];
			}
		}
		Cache::group_save("TagName",$TagName);
	}
}