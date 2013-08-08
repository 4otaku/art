<?php

namespace Otaku\Art\Module;

use Otaku\Framework\RequestItem;

class AjaxEditTag extends AjaxEditAbstract
{
	protected function make_request() {
		return new RequestItem($this->mode, $this,
			['id' => $this->id, 'add_tags' => 1]);
	}

	public function recieve_data($data) {
		usort($data['data']['tag'], function($a, $b){
			return strtolower($a['name']) > strtolower($b['name']);
		});
		parent::recieve_data($data);
	}
}