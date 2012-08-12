<?php

class Module_Html_Sidebar_Info extends Module_Html_Art_Abstract
{
	protected $css = array('sidebar');

	protected function get_params(Query $query) {
		$this->set_param('query', $query->to_url_string());
	}

	protected function make_request() {
		return new Request_Art($this->query->url(0), $this);
	}

	public function recieve_data($data) {
		if (!$data['count']) {
			return;
		}

		parent::recieve_data($data['data']);

		if (!empty($data['data']['source'])) {
			$source = new Text($data['data']['source']);
			$this->set_param('source', $source->links2html());
		}

		if (!empty($data['data']['weight'])) {
			$this->set_param('weight', $this->format_weight($data['data']['weight']));
		}

		if (
			isset($data['data']['state']) &&
			is_array($data['data']['state']) &&
			in_array('approved', $data['data']['state']) &&
			in_array('tagged', $data['data']['state'])
		) {
			$this->set_param('date_main', Util_Date::format($data['data']['sortdate']));
		}

		if (!empty($data['data']['created'])) {
			$this->set_param('created', Util_Date::format($data['data']['created']));
		}
	}
}
