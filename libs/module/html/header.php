<?php

class Module_Html_Header extends Module_Html_Abstract
{

	protected $css = array('header');
	/*	protected $js = array('jquery.min');

	protected function get_modules(Query $query)
	{
		if ($query->url(0) == 'slideshow') {
			return array(
				'body' => new Module_Html_Slideshow($query);
			}
		}

		return array(
			'header' => new Module_Html_Header($query),
			'body' => new Module_Html_Body($query)
		);
	}
	*/

	protected function get_params(Query $query)
	{
		$menu = Database::get_vector('head_menu_user',
			array('id', 'url', 'name'),
			'cookie = ? order by `order`',
			Config::get('cookie', 'hash')
		);

		$this->set_param('personal', $menu);
	}

	protected function make_request() {
		return new Request('head_menu', $this);
	}
}
