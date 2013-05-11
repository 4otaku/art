<?php

class Module_Ajax_Save extends Module_Ajax_Api
{
	protected $data;
	protected $api;
	protected $is_read = true;

	protected function get_params(Query $query) {
		$this->data = $query->get('data');
		$this->api = $query->get('api');
	}

	protected function make_request() {
		return new Request_Change('update_' . $this->api,
			$this, $this->data);
	}
}