<?php

namespace Otaku\Art;

use Otaku\Framework\ModuleHtmlAbstract;
use Otaku\Framework\Session;
use Otaku\Framework\Query;

class ModuleHtmlAdmin extends ModuleHtmlAbstract
{
	protected $css = ['admin'];
	protected $js = ['admin'];

	protected function get_modules(Query $query)
	{
		if (!Session::is_moderator()) {
			return [];
		}

		$return = [new ModuleHtmlAdminMenu($query)];

		if ($query->url(1) == 'tag') {
			$return[] = new ModuleHtmlAdminTag($query);
		}

		if ($query->url(1) == 'help') {
			$return[] = new ModuleHtmlAdminHelp($query);
		}

		if ($query->url(1) == 'similar') {
			$return[] = new ModuleHtmlAdminSimilar($query);
		}

		return $return;
	}
}
