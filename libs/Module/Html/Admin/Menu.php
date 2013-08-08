<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\HtmlAbstract;
use Otaku\Framework\Query;

class HtmlAdminMenu extends HtmlAbstract
{
	protected function get_params(Query $query)
	{
		$this->set_param('section', $query->url(1));
	}
}