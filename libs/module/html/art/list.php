<?php

class Module_Html_Art_List extends Module_Html_Art_Abstract
{
	protected $css = array('base');
	protected $js = array();
	protected $query_params = array();

	protected function get_modules(Query $query) {
		return array(
			'title' => new Module_Html_Art_Title($query),
			'search' => new Module_Html_Art_Search($query),
			'paginator' => new Module_Html_Art_Paginator($query)
		);
	}

	protected function get_params(Query $query) {
		$this->query_params = $query->other();
		$this->query_params['parsed'] = $query->parsed();
	}

	protected function make_request() {
		return new Request_Art_List($this, $this->query_params);
	}
/*
	public function recieve_data($data) {
		var_dump($data); die;
	}*/
}
