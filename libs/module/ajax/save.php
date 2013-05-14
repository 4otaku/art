<?php

class Module_Ajax_Save extends Module_Ajax_Api
{
	protected $data;
	protected $api;
	protected $create;

	protected function get_params(Query $query) {
		$this->data = $query->get('data');
		$this->api = $query->get('api');
		$this->create = (bool) $query->get('create');
	}

	protected function make_request() {
		return new Request_Change(($this->create ? 'create_' : 'update_') .
			$this->api,	$this, $this->data);
	}
}