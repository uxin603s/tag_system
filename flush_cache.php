<?php
include_once __DIR__."/include.php";


// file_put_contents($file, $person, FILE_APPEND | LOCK_EX);


// var_dump(Mcache::get('test'));
// exit;
// Mcache::init();
// Mcache::$con->delete("test");
// for($i=0;$i<10;$i++){
	// exec("nohup php test.php &");
// }
exit;
// for($i=0;$i<100;$i++){
	// Mcache::$con->increment("test");
// }
// var_dump(Mcache::$con->get("test"));
// exit;
// Fcache::del_all();

TagName::flushCache();
TagRelation::flushCache();
TagType::flushCache();
WebTagType::flushCache();
WebRelation::flushCache();

$result=[];
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
	$result[$val['id']]=$TagRelation;
	
}
$TagName=array_column(TagName::getCache(['id'=>$tids]),'name','id');

$WebTagType=WebTagType::getCache();
$web_data=[];

foreach($WebTagType as $val){
	$web_data[0][$val['tid']]=$result[$val['tid']];
	$web_data[$val['wid']][$val['tid']]=$result[$val['tid']];
}

var_dump($TagName);
var_dump($web_data);
exit;

