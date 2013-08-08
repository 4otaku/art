<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\HtmlAbstract;
use Otaku\Framework\Query;
use Otaku\Framework\Database;

class HtmlAddHelp extends HtmlAbstract
{
	protected $css = ['overlay', 'help'];
	protected $js = ['overlay', 'help'];

	protected function get_params(Query $query)
	{
		$this->set_param('text', (string) Database::get_field(
			'help', 'text', '`key` = ?', 'add'));
	}
}