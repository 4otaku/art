<?php

class Module_Ajax_Tag extends Module_Ajax_Json
{
	protected $params = array();

	protected function get_params(Query $query)
	{
		$this->params = $query->get();
		unset($this->params['format']);
	}

	protected function make_request()
	{
		return new Request_Read('tag_art', $this, $this->params);
	}

	public function recieve_data($data)
	{
		if (!empty($data['errors'])) {
			$error = reset($data['errors']);
			$this->set_error($error['code'], $error['message']);
		} else {
			$this->set_success(true);
			$this->set_data($data);
		}
	}
}
