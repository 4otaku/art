<?php

class Module_Html_Sidebar_Tool extends Module_Html_Art_Abstract
{
	protected $css = array('sidebar');

	protected function get_params(Query $query) {
		$this->set_param('query', $query->to_url_string());
	}
}
