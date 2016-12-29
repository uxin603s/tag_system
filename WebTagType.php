<?php
class WebTagType{
	public static $table='web_tag_type';
	public static $filter_field_arr=['tid','wid','sort_id'];
	public static $cache_key_field=["wid","tid"];
	use CRUD;
}