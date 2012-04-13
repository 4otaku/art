<?php

class Request_Single extends Request
{
	public function __construct($api = false, $object = false, $data = array()) {
		$data['per_page'] = 1;
		parent::__construct($api, $object, $data);
	}

	public function pass_data($data) {
		$data['data'] = reset($data['data']);
		parent::pass_data($data);
	}
}
