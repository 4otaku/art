<?php

namespace Otaku\Art;

class ModuleAjaxEditApprove extends ModuleAjaxEditAbstract
{
	protected function make_request() {
		return new RequestItem($this->mode, $this,
			['id' => $this->id, 'add_state' => 1]);
	}
}