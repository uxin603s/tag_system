<?php
include_once __DIR__."/include.php";

TagLevel::flushCache();
TagName::flushCache();
TagRelation::flushCache();
TagType::flushCache();
WebTagType::flushCache();
WebRelation::flushCache();
// var_dump(Cache::group_get_all("WebRelation1"));
// var_dump(Cache::group_get_all("WebRelation.wid.1.source_id.477"));
// var_dump(Cache::get_one("TagRelation",1));
exit;
