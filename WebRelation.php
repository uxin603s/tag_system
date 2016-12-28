<?php
class WebRelation{
	public static $table='web_relation';
	public static $filter_field_arr=['wid','source_id','tid','sort_id'];
	use CRUD;
	public static function flushCache(){
		$tmp=self::getList();
		$WebRelation=[];
		$WebRelationR=[];
		if($tmp['status']){
			foreach($tmp['list'] as $item){
				$WebRelation[$item['wid']][$item['source_id']][]=$item['tid'];
				$WebRelationR[$item['wid']][$item['tid']][]=$item['source_id'];
			}
		}
		foreach($WebRelation as $wid=>$item){
			Cache::group_save("WebRelation".$wid,$WebRelation[$wid]);
			Cache::group_save("WebRelationR".$wid,$WebRelationR[$wid]);
		}
	}
	
}