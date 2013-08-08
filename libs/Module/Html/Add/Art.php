<?php

namespace Otaku\Art;

use Otaku\Framework\ModuleHtmlAbstract;
use Otaku\Framework\Query;

class ModuleHtmlAddArt extends ModuleHtmlAbstract
{
	protected function get_modules(Query $query)
	{
		return [
			'form' => new ModuleHtmlAddForm($query),
			'help' => new ModuleHtmlAddHelp($query),
		];
	}
}