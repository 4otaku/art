<?php

namespace Otaku\Art;

use Otaku\Framework\ModuleHtmlAbstract;
use Otaku\Framework\Query;
use Otaku\Framework\Database;
use Otaku\Framework\Config;
use Otaku\Framework\RequestRead;

class ModuleHtmlHeader extends ModuleHtmlAbstract
{
	protected $css = array('base', 'header', 'overlay', 'setting');
	protected $js = array('overlay', 'setting', 'form', 'personal');

	protected function get_params(Query $query)
	{
		$menu = Database::get_table('head_menu_user',
			array('id', 'url', 'name'),
			'cookie = ? order by `order`',
			Config::get('cookie', 'hash')
		);

		$this->set_param('personal', $menu);
	}

	protected function make_request() {
		return new RequestRead('head_menu', $this);
	}
}
