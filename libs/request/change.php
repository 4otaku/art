<?php

class Request_Change extends Request
{
	public function perform()
	{
		$this->do_request($this->get_data());
	}

	protected function process_response($response)
	{
		$this->pass_data($response);
	}
}
