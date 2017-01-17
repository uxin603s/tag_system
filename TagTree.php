<?php
class TagTree{
	public static function getTagTypeAlias($tids){
		$result=[];
		$where_list=[];
		foreach($tids as $tid){
			$where_list[]=['field'=>'id','type'=>0,'value'=>$tid];
		}
		$tmp=TagType::getList(compact(['where_list']));
		if($tmp['status']){
			$names=array_column($tmp['list'],"id","name");
			$where_list=[];
			foreach($names as $name=>$id){
				$where_list[]=['field'=>'name','type'=>0,'value'=>$name];
			}
			$tmp=TagName::getList(compact(['where_list']));
			if($tmp['status']){
				$ids=array_column($tmp['list'],'id','name');
			}
			
			foreach($ids as $name=>$id){
				$result[$names[$name]]=$id;
			}
		}
		return $result;
		
		
	}
	public static function get($arg){
		$where_list=[
			['field'=>'wid','type'=>0,'value'=>$arg['wid']],
		];
		$tmp=WebTagType::getList(compact(['where_list']));
		$status=false;
		if($tmp['status']){
			$tids=array_column($tmp['list'],"tid");
			$type_to_tid=self::getTagTypeAlias($tids);
			
			$where_list=[];
			foreach($tids as $tid){
				$where_list[]=['field'=>'tid','type'=>0,'value'=>$tid];
			}
			$tmp=TagLevel::getList(compact(['where_list']));
			if($tmp['status']){
				$TagLevel=[];
				foreach($tmp['list'] as $val){
					$tid=$type_to_tid[$val['tid']];
					$TagLevel[$tid][$val['sort_id']]=$val['id'];
					krsort($TagLevel[$tid]);
				}
				
				$level_ids=array_column($tmp['list'],"id");
				
				$where_list=[];
				foreach($level_ids as $level_id){
					$where_list[]=['field'=>'level_id','type'=>0,'value'=>$level_id];
				}
				$tmp=TagRelation::getList(compact(['where_list']));
				$TagRelation=[];
				$tids=[];
				if($tmp['status']){
					foreach($tmp['list'] as $val){
						$TagRelation[$val['level_id']][$val['id']][$val['child_id']]=$val['child_id'];
						$tids[]=$val['child_id'];
					}
				}
				$copy_TagRelation=$TagRelation;
				$data=[];
				// $resultRow=[];
				foreach($TagLevel as $tid=>$level_ids){
					while(1){
						$level_id=array_shift($level_ids);
						
						if(count($level_ids)){
							foreach($TagRelation[$level_ids[0]] as $id=>$array){
								$tmp=$TagRelation[$level_id];
								unset($TagRelation[$level_id]);
								foreach($array as $child_id){
									if(!$tmp[$child_id]){
										$tmp[$child_id]=$child_id;
									}
									$TagRelation[$level_ids[0]][$id][$child_id]=$tmp[$child_id];
								}
							}							
						}else{
							
							$data[$tid]=$TagRelation[$level_id][0];
							break;
						}
					}
				}
				// var_dump($resultRow);
				// exit;
				$where_list=[];
				foreach($tids as $tid){
					$where_list[]=['field'=>'id','type'=>0,'value'=>$tid];
				}
				foreach($type_to_tid as $tid){
					$where_list[]=['field'=>'id','type'=>0,'value'=>$tid];
				}
				$tmp=TagName::getList(compact(['where_list']));
				$tagName=[];
				if($tmp['status']){
					foreach($tmp['list'] as $val){
						$tagName[$val['id']]=$val;
					}
				}
				$status=true;
				// $data=self::replace_tid($data,$tid_name);
				// var_dump($result);
			}
		}
		return compact(['status','tagName','data']);
	}
	public static function replace_tid($result,$tagName){
		if(is_array($result) && count($result)){
			foreach($result as $key=>$val){
				if(is_array($result[$key])){
					$result[$tagName[$key]]=self::replace_tid($result[$key],$tagName);
				}else{
					$result[$tagName[$key]]=$tagName[$val];
				}
				unset($result[$key]);
			}
		}
		return $result;
	}
}