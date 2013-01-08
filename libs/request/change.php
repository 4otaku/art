<?php

class Request_Change extends Request
{
	public function __construct($api = false, $object = false, $data = array(), $method = 'recieve_data')
	{
		$data['cookie'] = Session::get_instance()->get_hash();

		parent::__construct($api, $object, $data, $method);
	}

	protected function process_response($response)
	{
		$this->pass_data($response);
	}
}
