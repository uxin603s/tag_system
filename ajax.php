<?php
include_once __DIR__."/include.php";
session_start();
session_write_close();

if(isset($_SESSION['rid'])){
	
}else{
	if(isset($_GET['access_token'])){
		UserSystemHelp::login("UserSystemHelp::success","UserSystemHelp::error",false);
	}
}


if(isset($_SESSION['rid'])){
	
}else{
	$status=false;
	$message="權限不足";
	$reload=1;
	$result=compact(['status',"message","reload"]);
	echo json_encode($result);
	exit;
}

include_once __DIR__."/github/MysqlCompact/API.php";
DB::$connect=null;