<?php

namespace Otaku\Art;

use Otaku\Framework\ModuleHtmlAbstract;
use Otaku\Framework\Query;

class ModuleHtmlAdminMenu extends ModuleHtmlAbstract
{
	protected function get_params(Query $query)
	{
		$this->set_param('section', $query->url(1));
	}
}