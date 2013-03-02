<?php

abstract class Module_Ajax_Create_Abstract extends Module_Ajax_Json
{
	protected $data = [];
	protected $request_type = '';

	protected function make_request()
	{
		return new Request_Change($this->request_type, $this, $this->data);
	}

	public function recieve_data($data)
	{
		if (isset($data['id'])) {
			$this->set_param('id', $data['id']);
			$this->set_success(true);
		}
		if (isset($data['errors'])) {
			$error = reset($data['errors']);
			$this->set_error($error['code'], $error['message']);
		}
	}
}