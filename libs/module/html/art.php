<?php

class Module_Html_Art extends Module_Html_Abstract
{
	protected function get_modules(Query $query) {
		return array(
			'sidebar' => new Module_Html_Sidebar($query)
		);
	}
}