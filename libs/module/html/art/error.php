<?php

class Module_Html_Art_Error extends Module_Html_Art_Abstract
{
	protected function get_params(Query $query) {
		$this->set_param('have_message', false);
	}

	public function recieve_data($errors) {
		$message = array();
		foreach ($errors as $error) {
			if (isset($error['message'])) {
				$message[] = $error['message'];
			}
		}
		if (count($message)) {
			$this->set_param('have_message', true);
			$this->set_param('message', $message);
		}
	}
}
