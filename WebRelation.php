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
				$WebRelation[$item['wid']][$item['source_id']][$item['tid']]=$item['tid'];
				$WebRelationR[$item['wid']][$item['tid']][$item['source_id']]=$item['source_id'];
			}
		}
		
		foreach($WebRelation as $wid=>$source_id_arr){
			foreach($source_id_arr as $source_id=>$value){
				$key="WebRelation.wid.{$wid}.source_id.{$source_id}";
				Cache::group_save($key,$value);
			}			
		}
		foreach($WebRelationR as $wid=>$tid_id_arr){
			foreach($tid_id_arr as $tid=>$value){
				$key="WebRelationR.wid.{$wid}.tid.{$tid}";
				Cache::group_save($key,$value);
			}
		}
	}
	
}