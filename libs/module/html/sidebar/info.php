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

		if ($data['data']['source']) {
			$source = new Text($data['data']['source']);
			$this->set_param('source', $source->links2html());
		}

		$this->set_param('weight', $this->format_weight($data['data']['weight']));

		if (
			in_array('approved', $data['data']['state']) &&
			in_array('tagged', $data['data']['state'])
		) {
			$this->set_param('date_main', $this->format_time($data['data']['sortdate']));
		}

		$this->set_param('created', $this->format_time($data['data']['created']));
	}
}
