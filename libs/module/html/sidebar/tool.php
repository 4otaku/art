<?php

class Module_Html_Sidebar_Tool extends Module_Html_Abstract
{
	use Trait_Module_Art_List;

	protected $css = array('sidebar');

	protected function get_params(Query $query) {
		$this->set_param('query', $query->to_url_string());
		$this->set_param('slideshow_enabled',
			(!$query->get('mode') || $query->get('mode') == 'art'));
	}

	protected function make_request() {
		return $this->get_common_request();
	}

	public function recieve_data($data) {
		$this->set_param('count', (int) $data['count']);
	}
}
