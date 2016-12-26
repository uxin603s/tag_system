<?php

include_once __DIR__."/include.php";




session_start();
$_SESSION['id']=0;
session_write_close();
include_once __DIR__."/github/MysqlCompact/API.php";
DB::$connect=null;