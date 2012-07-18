<?php

class Module_Html_Sidebar_Info extends Module_Html_Art_Abstract
{
	protected $css = array('sidebar');
	protected $js = array('sidebar');

	protected function get_params(Query $query) {
		$this->set_param('query', $query->to_url_string());
	}

	protected function make_request() {
		return new Request_Art($this->query->url(0), $this);
	}

	public function recieve_data($data) {
		parent::recieve_data($data['data']);

		$this->set_param('weight', $this->format_weight($data['data']['weight']));
		$this->set_param('date', $this->format_time($data['data']['sortdate']));
	}
}
