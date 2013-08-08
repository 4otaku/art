<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\HtmlAbstract;
use Otaku\Framework\Session;
use Otaku\Framework\Query;

class HtmlAdmin extends HtmlAbstract
{
	protected $css = ['admin'];
	protected $js = ['admin'];

	protected function get_modules(Query $query)
	{
		if (!Session::getInstance()->is_moderator()) {
			return [];
		}

		$return = [new HtmlAdminMenu($query)];

		if ($query->url(1) == 'tag') {
			$return[] = new HtmlAdminTag($query);
		}

		if ($query->url(1) == 'help') {
			$return[] = new HtmlAdminHelp($query);
		}

		if ($query->url(1) == 'similar') {
			$return[] = new HtmlAdminSimilar($query);
		}

		return $return;
	}
}
