<?php

abstract class Module_Ajax_Api extends Module_Ajax_Json
{
	protected $is_read = false;

	public function recieve_data($data)
	{
		if (!empty($data['errors'])) {
			$error = reset($data['errors']);
			$this->set_error($error['code'], $error['message']);
		} else {
			$this->set_success(true);
			if ($this->is_read) {
				$this->set_data($data);
			}
		}
	}
}

