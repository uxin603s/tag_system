<?php
class WebTagType{
	public static $table='web_tag_type';
	public static $filter_field=['tid','wid','sort_id'];
	use CRUD;
}