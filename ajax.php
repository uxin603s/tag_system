<?php
session_start();
session_write_close();
include_once __DIR__."/include.php";



if(isset($_SESSION['rid'])){
	
}else{
	if(isset($_GET['access_token'])){
		UserSystemHelp::$location=false;
		UserSystemHelp::login();
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
