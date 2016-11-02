<?php
class TagRelationCount{
	public static $filter_field=['id','level_id','count'];
	public static function getList($arg){
		$bind_data=[];
		$where_str=MysqlCompact::where($arg['where_list'],self::$filter_field,$bind_data);		
		$sql="select * from tag_relation_count {$where_str} order by id desc,count desc";//
		
		if($tmp=DB::select($sql,$bind_data)){
			$status=true;
			$list=$tmp;
		}else{
			$status=false;
		}
		return compact(['status','list','sql','bind_data','pageData']);
	}
	public static function insert($insert){
		DB::insert($insert,"tag_relation_count");
		if(isset($insert['count'])){
			$insert['count']=0;
		}
		return $insert;
	}
	public static function delete($arg){
		
		$where_list=[
			['field'=>'id','type'=>0,'value'=>$arg['id']],
			['field'=>'level_id','type'=>0,'value'=>$arg['level_id']],
			['field'=>'count','type'=>0,'value'=>0],
		];
		$tmp=self::getList(compact(["where_list"]));
		if($tmp['status']){
			if($p_level_id=TagRelationLevel::get_p_level_id($arg['level_id'])){
				$where_list=[
					['field'=>'child_id','type'=>0,'value'=>$arg['id']],
					['field'=>'level_id','type'=>0,'value'=>$p_level_id],
				];
				$tmp1=TagRelation::getList(compact(["where_list"]));//確保別的人沒有關聯才刪除
			}else{
				$tmp1['status']=false;
			}
			if($tmp1['status']){
				$status=true;
				$message="假刪除成功";
			}else{
				$where=[];
				$where['id']=$arg['id'];
				$where['level_id']=$arg['level_id'];
				$where['count']=0;//確保移除的是count等於0
				if(DB::delete($where,"tag_relation_count")){
					$status=true;
					$message="刪除成功";
				}else{
					$status=false;
					$message="刪除失敗";
				}
			}
		}else{
			$status=false;
			$message="刪除失敗";
		}
		
		return compact(['arg','tmp','where','status','message','ggwp','tmp1','p_level_id']);
	}
}