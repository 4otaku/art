<?php

namespace Otaku\Art;

class Module_Html_Add_Help extends Module_Html_Abstract
{
	protected $css = ['overlay', 'help'];
	protected $js = ['overlay', 'help'];

	protected function get_params(Query $query)
	{
		$this->set_param('text', (string) Database::get_field(
			'help', 'text', '`key` = ?', 'add'));
	}
}