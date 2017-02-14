<?php
class TagRelation{
	public static $table='tag_relation';
	public static $filter_field_arr=['id','level_id','child_id','sort_id'];
	public static $cache_key_field=["level_id","id","child_id"];
	use CRUD;
}