<?php

class Request_Item extends Request
{
	public function __construct($api = false, $object = false, $data = [], $method = 'recieve_data') {
		$data['per_page'] = 1;
		parent::__construct($api, $object, $data, $method);
	}

	public function pass_data($data) {
		$data['data'] = reset($data['data']);
		parent::pass_data($data);
	}
}
