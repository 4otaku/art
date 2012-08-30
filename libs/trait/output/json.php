<?php

trait Trait_Output_Json
{
	private $success = false;
	private $error = '';
	private $error_code = 0;

	protected function format_data() {
		$data = $this->params;
		$data['success'] = $this->success;

		if (!$data['success']) {
			$data['errors'] = array(array('code' => $this->error_code,
				'message' => $this->error));
		}

		return json_encode($data);
	}

	protected function set_success($success) {
		$this->success = (bool) $success;
	}

	protected function set_error($code, $message = '') {
		$this->error_code = (int) $code;
		$this->error = (string) $message;
	}
}
