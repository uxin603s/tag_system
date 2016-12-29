<?php
class WebRelation{
	public static $table='web_relation';
	public static $filter_field_arr=['wid','source_id','tid','sort_id'];
	
	public static $cache_key_field=["wid","source_id","tid"];
	
	use CRUD;
	// {
		// CRUD::delete as tmp_delete;
	// }
}
