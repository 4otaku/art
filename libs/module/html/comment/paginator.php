<?php

class Module_Html_Comment_Paginator extends Module_Html_Abstract
{
	use Trait_Module_Paginator, Trait_Module_Art;

	protected $js = ['comment'];
	protected $css = ['paginator'];

	protected $per_page = 7;
	protected $page = 1;

	public function set_page($value) {
		$this->page = $value;
		return $this;
	}

	public function set_per_page($value) {
		$this->per_page = $value;
		return $this;
	}

	public function set_id($value) {
		$this->set_param('id_item', $value);
		return $this;
	}

	protected function get_page() {
		return $this->page;
	}

	protected function get_per_page() {
		return $this->per_page;
	}

	protected function get_url() {
		$url_string = $this->get_query()->to_url_string();
		if (!empty($url_string)) {
			$url_string .= '&';
		}
		return $url_string;
	}

	public function recieve_data($data) {
		$last = ceil($data['count'] / $this->get_per_page());
		if ($last < 2) {
			$this->disable();
		}

		$this->build_pager($data['count']);
	}
}
