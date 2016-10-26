<?php
/*
$where_list=[
	[
		"field"=>"",//欄位名稱
		"type"=>"",//組合符號0:=,1:!=,2:like,3:not like
		"value"=>"",//欄位值
	]
];
*/
class MysqlCompact{
	public static $type_list=[
		"=",
		"!=",
		"like",
		"not like",
	];
	public static function where($where_list=[],$filter_fields=[],&$bind_data){
		$query_str="where 1=1 ";
		
		$used_count=array_count_values(array_column($where_list,'field'));
		$or_array=[];
		$and_array=[];
		foreach($used_count as $field=>$count){
			if($count>1){
				$or_array[]=$field;
			}else{
				$and_array[]=$field;
			}
		}
		$or_where=[];
		foreach($where_list as $item){
			$field=$item['field'];
			$type=$item['type'];
			$value=$item['value'];
			$symbol=self::$type_list[$type];
			//欄位白名單
			if(in_array($field,$filter_fields) && $symbol){
				if(in_array($field,$and_array)){
					$query_str.=" && {$field} {$symbol} ?";
					$bind_data[]=$value;
				}else if(in_array($field,$or_array)){
					$or_where[$field]['query'][]=" {$field} {$symbol} ? ";
					$or_where[$field]['value'][]=$value;
				}
			}
		}
		foreach($or_where as $field=>$item){
			$query_str.=" && (".implode(" || ",$item['query']).")";
			$bind_data=array_merge($bind_data,$item['value']);
		}
		
		return $query_str;
	}
	public static $sort_list=[
		"asc",
		"desc",
	];
	public static function orderBy($orderBy_list,$filter_fields=[]){
		$query_str="order by ";
		$order_array=[];
		foreach($orderBy_list as $item){
			$field=$item['field'];
			$sort=self::$sort_list[$item['type']];
			if(in_array($field,$filter_fields) && $sort){
				$order_array[]="{$field} {$sort}";
			}
		}
		$query_str.=implode(",",$order_array);
		return $query_str;
	}
}
