<?php

namespace Otaku\Art;

class ModuleHtmlAdminMenu extends ModuleHtmlAbstract
{
	protected function get_params(Query $query)
	{
		$this->set_param('section', $query->url(1));
	}
}