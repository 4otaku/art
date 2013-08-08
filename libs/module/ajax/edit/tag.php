<?php

namespace otaku\art;

class Module_Ajax_Edit_Tag extends Module_Ajax_Edit_Abstract
{
	protected function make_request() {
		return new Request_Item($this->mode, $this,
			['id' => $this->id, 'add_tags' => 1]);
	}

	public function recieve_data($data) {
		usort($data['data']['tag'], function($a, $b){
			return strtolower($a['name']) > strtolower($b['name']);
		});
		parent::recieve_data($data);
	}
}