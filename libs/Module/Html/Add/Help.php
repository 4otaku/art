<?php

namespace Otaku\Art;

use Otaku\Framework\ModuleHtmlAbstract;
use Otaku\Framework\Query;
use Otaku\Framework\Database;

class ModuleHtmlAddHelp extends ModuleHtmlAbstract
{
	protected $css = ['overlay', 'help'];
	protected $js = ['overlay', 'help'];

	protected function get_params(Query $query)
	{
		$this->set_param('text', (string) Database::get_field(
			'help', 'text', '`key` = ?', 'add'));
	}
}