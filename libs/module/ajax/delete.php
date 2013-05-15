<?php

class Module_Ajax_Delete extends Module_Ajax_Api
{
	protected $api;
	protected $id;

	protected function get_params(Query $query) {
		$this->id = $query->get('id');
		$this->api = $query->get('api');
	}

	protected function make_request() {
		return new Request_Change('delete_' . $this->api, $this,
			['id' => $this->id]);
	}
}