<?php

class Module_Ajax_Art_list extends Module_Html_Art_Abstract
{
	protected $data = array();
	protected $header = array('Content-type' => 'application/json');

	protected function get_modules(Query $query) {
		return array();
	}

	protected function make_request() {
		return $this->get_common_request();
	}

	public function recieve_data($data) {
		$this->data = isset($data['data']) ? $data['data'] : array();
	}

	public function get_html() {
		return json_encode($this->data);
	}
}
