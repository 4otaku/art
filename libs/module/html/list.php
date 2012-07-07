<?php

class Module_Html_List extends Module_Html_Abstract
{
	protected $css = array('base');
	protected $js = array();

	protected function get_modules(Query $query) {
		return array(
			'title' => new Module_Html_Part_Title($query),
			'search' => new Module_Html_Part_Search($query),
			'paginator' => new Module_Html_Part_Paginator($query)
		);
	}

	protected function get_params(Query $query) {
	}

	protected function make_request() {
		return new Request('art_list', $this);
	}
/*
	public function recieve_data($data) {
		var_dump($data); die;
	}*/
}
