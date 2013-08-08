<?php

namespace otaku\art;

class Module_Html_Admin_Help extends Module_Html_Abstract
{
	protected $js = ['external/wysibb', 'wysibb', 'form'];

	protected function get_params(Query $query)
	{
		$this->set_param('text', (string) Database::get_field(
			'help', 'text', '`key` = ?', 'add'));
	}
}