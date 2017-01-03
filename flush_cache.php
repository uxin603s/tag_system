<?php
include_once __DIR__."/include.php";


TagLevel::flushCache();
TagName::flushCache();
TagRelation::flushCache();
TagType::flushCache();
WebTagType::flushCache();
WebRelation::flushCache();


// $WebRelation=WebRelation::getCache();

// var_dump($WebRelation);
// exit;


$TagType=TagType::getCache();
$tids=[];
foreach($TagType as $val){
	$TagLevel=TagLevel::getCache(['tid'=>$val['id']]);
	usort($TagLevel,function($a,$b){
		return $b['sort_id']-$a['sort_id'];
	});
	$level_ids=array_column($TagLevel,"id");
	
	$TagRelation=[];
	$tmp=TagRelation::getCache(['level_id'=>$level_ids]);
	
	foreach($tmp as $item){
		$tids[$item['child_id']]=$item['child_id'];
		$TagRelation[$item['level_id']][$item['id']][$item['child_id']]=$item['child_id'];
	}
	
	while(1){
		$level_id=array_shift($level_ids);
		if(count($level_ids)){
			foreach($TagRelation[$level_ids[0]] as $id=>$array){
				$tmp=$TagRelation[$level_id];
				unset($TagRelation[$level_id]);
				foreach($array as $child_id){
					$TagRelation[$level_ids[0]][$id][$child_id]=$tmp[$child_id];
				}
			}
		}else{
			break;
		}
	}
	$TagRelation=array_pop($TagRelation);
	$TagRelation=array_pop($TagRelation);
	
	var_dump($TagRelation);
	
}
$TagName=array_column(TagName::getCache(['id'=>$tids]),'name','id');
var_dump($TagName);


// $list=Fcache::where();
// $list=Fcache::del_all();
// var_dump(Cache::group_get_all("WebRelation1"));
// var_dump(Cache::group_del_all("WebRelation.wid.1.source_id.477"));
// var_dump(Cache::get_one("TagRelation",1));
exit;
