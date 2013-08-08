<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\HtmlAbstract;
use Otaku\Framework\Query;

class HtmlAddArt extends HtmlAbstract
{
	protected function get_modules(Query $query)
	{
		return [
			'form' => new HtmlAddForm($query),
			'help' => new HtmlAddHelp($query),
		];
	}
}