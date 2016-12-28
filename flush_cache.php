<?php
include_once __DIR__."/include.php";

TagLevel::flushCache();
TagName::flushCache();
TagRelation::flushCache();
TagType::flushCache();
WebTagType::flushCache();
WebRelation::flushCache();
var_dump(Cache::get_all("TagType"));
// var_dump(Cache::get_one("TagRelation",1));
exit;
