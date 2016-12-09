<?php
class WebList{
	public static $table='web_list';
	public static $filter_field_arr=['id','name','sort_id'];
	use CRUD;
}