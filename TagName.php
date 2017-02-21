<?php
class TagName{
	public static $table='tag_name';
	public static $filter_field_arr=['id','name',];
	public static $cache_key_field=["id",];
	use CRUD {
		CRUD::flushCache as private tmp_flushCache;
	}
	
	public static function flushCache($arg,$type){
		/**
		1變數
		2標籤
		3文章標籤
		4粉絲標籤
		**/
		if($type!=0){
			file_get_contents("http://tw.funfunquiz.com/cache_flush.php?id=2");
			self::tmp_flushCache($arg,$type);
		}
	}
	
}