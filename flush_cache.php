<?php
include_once __DIR__."/include.php";


// WebRelation::flushCache();


var_dump(count(WebRelation::getCache(['tid'=>555,],[],['count'=>200,'page'=>$argv[1],'rand'=>false,])));
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

