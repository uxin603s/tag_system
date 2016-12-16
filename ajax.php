<?php

include_once __DIR__."/github/DB/DB.php";
include_once __DIR__."/github/MysqlCompact/MysqlCompact.php";
include_once __DIR__."/github/MysqlCompact/CRUD.php";

include_once __DIR__."/WebList.php";
include_once __DIR__."/TagType.php";
include_once __DIR__."/WebTagType.php";
include_once __DIR__."/TagName.php";

include_once __DIR__."/TagRelation.php";

include_once __DIR__."/TagLevel.php";

include_once __DIR__."/WebRelation.php";


$DBConfig=json_decode(file_get_contents(__DIR__."/config/DB.json"),1);
DB::$config=$DBConfig;
DB::query("SET NAMES utf8");

session_start();
$_SESSION['id']=0;
session_write_close();
include_once __DIR__."/github/MysqlCompact/API.php";
DB::$connect=null;