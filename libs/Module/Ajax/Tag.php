<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\AjaxJson;
use Otaku\Framework\Query;
use Otaku\Framework\RequestRead;

class AjaxTag extends AjaxJson
{
	protected $params = array();

	protected function get_params(Query $query)
	{
		$this->params = $query->get();
		unset($this->params['format']);
	}

	protected function make_request()
	{
		return new RequestRead('tag_art', $this, $this->params);
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
