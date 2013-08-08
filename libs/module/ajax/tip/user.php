<?php

namespace otaku\art;

class Module_Ajax_Tip_User extends Module_Ajax_Tip_Abstract
{
	protected $request_type = 'left';
	protected $request_name_field = 'login';
	protected $request_data_fields = array();

	protected function parse_raw_term()
	{
		return parent::parse_raw_term()->cut_on("\t ");
	}

	protected function get_request_name()
	{
		$class = strtolower(get_called_class());
		return str_replace('module_ajax_', '', $class);
	}
}
