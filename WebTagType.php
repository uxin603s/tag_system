<?php
class WebTagType{
	public static $table='web_tag_type';
	public static $filter_field_arr=['tid','wid','sort_id'];
	use CRUD;
	public static function flushCache(){
		$tmp=self::getList();
		$WebTagType=[];
		$TagTypeWeb=[];
		if($tmp['status']){
			foreach($tmp['list'] as $item){
				$WebTagType[$item['wid']][]=$item['tid'];
				$TagTypeWeb[$item['tid']][]=$item['wid'];
			}
		}
		Cache::group_save("WebTagType",$WebTagType);
		Cache::group_save("TagTypeWeb",$TagTypeWeb);
	}
}