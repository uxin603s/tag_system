<?php
class TagRelation{
	public static $table='tag_relation';
	public static $filter_field_arr=['id','level_id','child_id','sort_id'];
	use CRUD;
}