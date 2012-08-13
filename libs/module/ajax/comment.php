<?php

class Module_Ajax_Comment extends Module_Ajax_Json
{
	protected $id = 0;

	protected function get_params(Query $query)
	{
		$this->id = (int) $query->get('id');
	}

	protected function make_request() {
		if (empty($this->id)) {
			$this->success = false;
			return false;
		}

		return new Request('comment', $this, array(
			'filter' => array('id' => $this->id)
		));
	}

	public function recieve_data($data) {
		if (empty($data['data'])) {
			$this->success = false;
		}

		$this->success = true;
		$this->params = reset($data['data']);
	}
}
