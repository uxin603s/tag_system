<?php
class TagType{
	public static $table='tag_type';
	public static $filter_field=["id","name","sort_id"];
	use CRUD;
}