<?php
class TagName{
	public static $table='tag_name';
	public static $filter_field_arr=['id','name',];
	public static $cache_key_field=["id",];
	use CRUD;
	
}