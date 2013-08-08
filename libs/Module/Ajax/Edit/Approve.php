<?php

namespace Otaku\Art\Module;

use Otaku\Framework\RequestItem;

class AjaxEditApprove extends AjaxEditAbstract
{
	protected function make_request() {
		return new RequestItem($this->mode, $this,
			['id' => $this->id, 'add_state' => 1]);
	}
}