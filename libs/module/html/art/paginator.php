<?php

class Module_Html_Art_Paginator extends Module_Html_Art_Abstract
{
	use Trait_Module_Paginator, Trait_Module_Art_List;

	protected $css = array('paginator');

	protected function make_request() {
		return $this->get_common_request();
	}

	protected function get_page() {
		return $this->get_query()->page();
	}

	protected function get_per_page() {
		return $this->get_query()->per_page();
	}

	protected function get_url() {
		return $this->get_query()->to_url_string();
	}

	public function recieve_data($data) {
		$this->build_pager($data['count']);
	}
}
