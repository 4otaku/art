<?php

namespace Otaku\Art;

class Module_Html_Admin_Menu extends Module_Html_Abstract
{
	protected function get_params(Query $query)
	{
		$this->set_param('section', $query->url(1));
	}
}