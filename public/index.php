<!DOCTYPE html>
<html>
<head>
	<title></title>
	<script src="js/jquery-1.12.4.min.js"></script>
	<script src="js/angular-1.5.8.min.js"></script>
	<script src="js/localForage-1.4.2.min.js"></script>
	<script src="app/app.js"></script>
	<script src="app/run/base.js"></script>
	
	<script src="app/controllers/ApiCtrl.js"></script>
	<script src="app/controllers/LevelCtrl.js"></script>
	<script src="app/controllers/RelationCtrl.js"></script>
	
	<script src="app/directives/parseInt/parseInt.js"></script>
	<script src="app/directives/ngRightClick/ngRightClick.js"></script>
	<script src="app/directives/pagnation/pagnation.js"></script>
	
	<script src="app/factories/tagRelationCount.js" ></script>
	<script src="app/factories/tagRelation.js" ></script>
	
	<script src="app/directives/tagRelationCount/tagRelationCount.js" ></script>
	<script src="app/directives/tagRelation/tagRelation.js" ></script>
	
	<link rel="stylesheet" type="text/css" href="css/bootstrap-3.3.7.min.css" />
	<style>
	.col-xs-1,.col-xs-2,.col-xs-3,.col-xs-4,.col-xs-5,.col-xs-6,.col-xs-7,.col-xs-8,.col-xs-9,.col-xs-10,.col-xs-11,.col-xs-12{
		padding:0;
	}
	.bottom_line{
		border-bottom: 1px solid #c6c6c6;
		padding-bottom:5px;
		margin-bottom:5px;
	}
	
	.odd>div:nth-child(odd){
		background:#eee;
	}
	.even>div:nth-child(even){
		background:#eee;
	}
	.odd div,.even div{
		height:100%;
	}

	</style>
</head>
<body ng-app="app" class="container">
	
	<button
	ng-click="$parent.user_config.select_page=$index"
	ng-class="$parent.user_config.select_page==$index?'btn-danger':'btn-primary'"
	class="btn"
	ng-repeat="item in page_list"
	>{{item.name}}</button>
	<div 
	ng-include="'app/templates/'+page_list[user_config.select_page].templateName" ><div>
</body>
</html>