<?php

class Module_Ajax_Comment extends Module_Html_Abstract
{
	protected function get_modules(Query $query) {
		return new Module_Html_Comment_List($query);
	}

	public function get_css() {
		return array();
	}

	public function get_js() {
		return array();
	}
}
