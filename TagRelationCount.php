<?php
class TagRelationCount{
	public static function getList($arg){
		$limit_str="";
		if(!isset($arg['pageData'])){
			$arg['pageData']['limit_count']=10;
			$arg['pageData']['limit_page']=0;
		}
		$count=$arg['pageData']['limit_count'];
		$start=$arg['pageData']['limit_page']*$count;
		$limit_str=" limit {$start} , {$count}";
		$pageData=$arg['pageData'];
		
		
		$where_str="";
		$where=[];
		$bind_data=[];
		if(isset($arg['name']) && $arg['name']){
			$tag_data=TagName::getList($arg['name']);
			if($tag_data['status']){
				$where[]="id in (".implode(",",array_column($tag_data['list'],"id")).") ";
			}else{
				$where[]="id = false";
			}
		}
		if(isset($arg['ids']) && is_array($arg['ids'])){
			$where[]="id in (".implode(",",array_fill(0,count($arg['ids']),"?")).")";
			$bind_data=array_merge($bind_data,$arg['ids']);
		}
		if(isset($arg['level_id'])){
			$where[]="level_id = ?";
			$bind_data[]=$arg['level_id'];
		}
		if(count($where)){
			$where_str.=" where ";
			$where_str.=implode(" && ",$where);
		}
		$sql="select * from tag_relation_count {$where_str} order by id desc,count desc {$limit_str}";//
		
		if($tmp=DB::select($sql,$bind_data)){
			$status=true;
			$list=$tmp;
			$count_sql="select * from tag_relation_count {$where_str} ";
			
			$pageData['total_count']=count(DB::select($count_sql,$bind_data));
		}else{
			$pageData['total_count']=0;
			$status=false;
		}
		return compact(['status','list','sql','bind_data','pageData']);
	}
	public static function insert($arg){
		if(isset($arg['name'])){
			$tag_data=TagName::insert($arg['name']);
			$id=$tag_data['id'];
		}else if(isset($arg['id'])){
			$id=$arg['id'];
		}else{
			return [];
		}
		
		$level_id=$arg['level_id'];
		$count=0;
		$insert=compact(['id','level_id','count']);
		DB::insert($insert,"tag_relation_count");
		return compact(['insert']);
	}
	public static function delete($arg){
		$where=$arg;
		$where['count']=0;//確保移除的是count等於0
		if(DB::delete($where,"tag_relation_count")){
			TagRelation::delete($arg);
			$status=true;
			$message="刪除成功";
		}else{
			$status=false;
			$message="刪除失敗";
		}
		return compact(['status','message']);
	}
}