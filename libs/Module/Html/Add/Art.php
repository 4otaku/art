<?php

namespace Otaku\Art;

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