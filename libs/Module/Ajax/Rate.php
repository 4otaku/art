<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\AjaxJson;
use Otaku\Framework\Query;
use Otaku\Framework\RequestUpdate;

class AjaxRate extends AjaxJson
{
	protected $id;
	protected $approve;

	protected function get_params(Query $query) {
		$this->id = $query->get('id');
		$this->approve = $query->get('approve');
	}

	protected function make_request() {
		return new RequestUpdate('art_rating', $this,
			['id' => $this->id, 'approve' => $this->approve]);
	}

	public function recieve_data($data) {
		$this->set_success($data['success']);
		if (!empty($data['errors'])) {
			foreach ($data['errors'] as $error) {
				$this->set_error($error['code'], $error['message']);
			}
		}
	}
}