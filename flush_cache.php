<?php
include_once __DIR__."/include.php";
WebRelation::flushCache();
exit;
$time=microtime(1);
TagName::getCache(['where'=>['id'=>1]]);
echo microtime(1)- $time;

exit;
// WebRelation::flushCache();
// exit;
// $dd=WebRelation::getCache(['where'=>['tid'=>555,]]);

$source_id=[];
while(true){
	
	$gg=["10474","11616","10869","10157","9145","11006","9881","5752","6273","1662","13862","13760","14635","6095","6345","7314","11048","14704","15072","14177","11021","12013","11957","11830","11855","11961","12350","16562","8115","9296","11833","11025","6983","2363","3257","1144","3965","1839","720","7677","5320","3634","4944","7693","10489"];
	$qq=array_values(array_diff($gg,$source_id));
	echo "\n";
	var_dump(json_encode($qq));
	if(!count($qq))break;
	$time=microtime(1);
	$dd=WebRelation::getCache([
	// 'group'=>['source_id','tid'],
	// 'required'=>[555,2,1],
	// 'not_required'=>[2],
	// 'optional'=>[555],
	'where'=>['tid'=>[555,2,1],'source_id'=>$qq],
	'not_where'=>['source_id'=>$source_id],
	'limit'=>[
		'count'=>10,
		'page'=>$argv[1],
		'rand'=>true,
	],
	]);
	echo microtime(1)-$time;
	foreach($dd as $val){
		$source_id[]=$val;
	}
	
	// var_dump(json_encode($source_id));
	var_dump(count($dd));
}

var_dump(($dd));
exit;
TagName::flushCache();
TagLevel::flushCache();
TagRelation::flushCache();
TagType::flushCache();
WebTagType::flushCache();
WebRelation::flushCache();

// var_dump(WebRelation::getCache(['wid'=>1,'source_id'=>4]));
// exit;
$web_data=[];
$tids=[];
$WebTagTypes=WebTagType::getCache();

foreach($WebTagTypes as $WebTagType){
	$TagTypes=TagType::getCache(['id'=>$WebTagType['tid']]);
	foreach($TagTypes as $TagType){
		$TagLevel=TagLevel::getCache(['tid'=>$TagType['id']]);
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
		
		if($TagRelation){
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
		}
		$web_data[0][$WebTagType['tid']]=$TagRelation;
		$web_data[$WebTagType['wid']][$WebTagType['tid']]=$TagRelation;
		
	}
}
$TagName=array_column(TagName::getCache(['id'=>$tids]),'name','id');



var_dump($TagName);
var_dump($web_data);
exit;

