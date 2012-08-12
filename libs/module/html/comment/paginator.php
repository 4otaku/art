<?php

class Module_Html_Comment_Paginator extends Module_Html_Art_Paginator
{
	protected $per_page = 7;
	protected $page = 1;

	protected function make_request() {
		return false;
	}

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

	public function recieve_data($data) {
		$last = ceil($data['count'] / $this->get_per_page());
		if ($last < 2) {
			$this->disable();
		}

		parent::recieve_data($data);
	}
}
