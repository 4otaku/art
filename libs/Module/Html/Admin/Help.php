<?php

namespace Otaku\Art;

use Otaku\Framework\ModuleHtmlAbstract;
use Otaku\Framework\Query;
use Otaku\Framework\Database;

class ModuleHtmlAdminHelp extends ModuleHtmlAbstract
{
	protected $js = ['external/wysibb', 'wysibb', 'form'];

	protected function get_params(Query $query)
	{
		$this->set_param('text', (string) Database::get_field(
			'help', 'text', '`key` = ?', 'add'));
	}
}