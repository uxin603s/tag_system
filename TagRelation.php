<?php
class TagRelation{
	public static $table='tag_relation';
	public static $filter_field=['id','level_id','child_id','sort_id'];
	use CRUD;
	
}