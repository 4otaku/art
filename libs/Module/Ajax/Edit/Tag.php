<?php

namespace Otaku\Art;

use Otaku\Framework\RequestItem;

class ModuleAjaxEditTag extends ModuleAjaxEditAbstract
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