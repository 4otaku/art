<?php

namespace otaku\art;

class Module_Html_Art_Paginator extends Module_Html_Art_Abstract
{
	use Trait_Module_Paginator, Trait_Module_Art_List;

	protected $css = array('paginator');
	protected $have_next_page = false;

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
		$url_string = $this->get_query()->to_url_string();
		if (!empty($url_string)) {
			$url_string .= '&';
		}
		return $url_string;
	}

	public function recieve_data($data) {
		$max = ceil($data['count'] / $this->get_per_page());
		$this->have_next_page = $max > $this->get_page();

		$this->build_pager($data['count']);
	}

	public function get_prefetch() {
		if (!$this->have_next_page) {
			return [];
		}

		$url = $this->get_url();

		return '/?' . $url . 'page=' . ($this->get_page() + 1);
	}
}
