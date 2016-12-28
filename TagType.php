<?php
class TagType{
	public static $table='tag_type';
	public static $filter_field_arr=["id","name","sort_id"];
	use CRUD {
		CRUD::delete as tmp_delete;
	}
	public static function flushCache(){
		$tmp=self::getList();
		$TagType=[];
		if($tmp['status']){
			foreach($tmp['list'] as $item){
				$TagType[$item['id']]=$item['name'];
			}
		}
		Cache::run("TagType",$TagType);
	}
	public static function delete($arg){
		if(isset($arg['id'])){
			$where_list=[
				['field'=>'tid','type'=>0,'value'=>$arg['id']],
			];
			$result=WebTagType::getList(compact(["where_list"]));
			if(!$result['status']){
				return self::tmp_delete($arg);
			}
		}
		$status=false;
		$message="WebTagType有關聯資料無法刪除";
		return compact(['status','message']);
	}
}