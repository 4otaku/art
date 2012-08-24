<?php

class Module_Ajax_Art_list extends Module_Html_Art_Abstract
{
	protected $data = array();
	protected $count = 0;

	protected function get_modules(Query $query) {
		return array('list' =>
			new Module_Container('html_art_image'));
	}

	protected function make_request() {
		return $this->get_common_request();
	}

	public function recieve_data($data) {
		$data = isset($data['data']) ? $data['data'] : array();
		$this->count = isset($data['count']) ? $data['count'] : 0;

		foreach ($data as $item) {
			$this->data[] = $item['id'];
		}

		$request = new Request('art', $this, array(
			'id' => $this->data,
			'add_translations' => 1
		), 'recieve_details');
		$request->perform();
	}

	public function recieve_details($data) {
		$data = isset($data['data']) ? $data['data'] : array();
		foreach ($this->data as $key => $id) {
			foreach ($data as $item) {
				if ($item['id'] == $id) {
					$this->data[$key] = $item;
					continue 2;
				}
			}
			unset($this->data[$key]);
		}
		$this->modules['list']->recieve_data($this->data);
	}

	public function get_css() {
		return array();
	}

	public function get_js() {
		return array();
	}
}
