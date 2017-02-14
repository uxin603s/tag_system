<?php
class WebRelation{
	public static $table='web_relation';
	public static $filter_field_arr=['wid','source_id','tid','sort_id'];
	
	public static $cache_key_field=["wid","source_id","tid"];
	
	use CRUD{
		CRUD::insert as private tmp_insert;
		CRUD::delete as private tmp_delete;
	}
	public static function flushCache($arg,$type){
		/**
		1變數
		2標籤
		3文章標籤
		4粉絲標籤
		**/
		if($type!=0){
			file_get_contents("http://tw.funfunquiz.com/cache_flush.php?id=3");
			file_get_contents("http://tw.funfunquiz.com/cache_flush.php?id=4");
		}
	}
	public static function tagToId($tag_name){
		$where_list=[
			['field'=>'name','type'=>0,'value'=>$tag_name]
		];
		$tmp=TagName::getList(compact(['where_list']));
		if($tmp['status']){
			$tagdata=$tmp['list'][0];
		}else{
			$tmp=TagName::insert(['name'=>$tag_name]);
			if($tmp['status']){
				$tagdata=$tmp['insert'];
			}
		}
		return $tagdata['id'];
	}
	public static function delete($arg){
		if($arg['tag_name']){
			$arg['tid']=self::tagToId($arg['tag_name']);
		}
		if($arg['tid']){
			return self::tmp_delete($arg);
		}else{
			$status=false;
			return compact(['status']);
		}
	}
	public static function insert($arg){
		if($arg['tag_name']){
			$arg['tid']=self::tagToId($arg['tag_name']);
		}
		if($arg['tid']){
			return self::tmp_insert($arg);
		}else{
			$status=false;
			return compact(['status']);
		}
	}
}