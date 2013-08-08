<?php

namespace Otaku\Art;

class ModuleHtmlAdminHelp extends ModuleHtmlAbstract
{
	protected $js = ['external/wysibb', 'wysibb', 'form'];

	protected function get_params(Query $query)
	{
		$this->set_param('text', (string) Database::get_field(
			'help', 'text', '`key` = ?', 'add'));
	}
}