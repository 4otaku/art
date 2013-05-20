<?php

class Module_Ajax_Delete extends Module_Ajax_Api
{
	protected $data;
	protected $api;

	protected function get_params(Query $query) {
		$this->data = $query->get('id') ?
			['id' => $query->get('id')] : $query->get('data');
		$this->api = $query->get('api');
	}

	protected function make_request() {
		return new Request_Change('delete_' . $this->api, $this, $this->data);
	}
}