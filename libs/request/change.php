<?php

class Request_Change extends Request
{
	protected function process_response($response)
	{
		$this->pass_data($response);
	}
}
