<?php

abstract class Module_Ajax_Json extends Module_Html_Abstract
{
	protected $success = false;
	protected $error = '';
	protected $error_code = 0;
	protected $params = array();

	public function get_html() {
		$data = $this->params;
		$data['success'] = $this->success;

		if (!$data['success']) {
			$data['errors'] = array(array('code' => $this->error_code,
				'message' => $this->error));
		}

		return json_encode($data);
	}
}
