<?php

class Module_Ajax_Edit_Tag extends Module_Ajax_Edit_Abstract
{
	protected function make_request() {
		return new Request_Item($this->mode, $this,
			['id' => $this->id, 'add_tags' => 1]);
	}
}