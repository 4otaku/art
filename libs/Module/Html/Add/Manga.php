<?php

namespace Otaku\Art;

class ModuleHtmlAddManga extends ModuleHtmlAddPool
{
	protected function get_modules(Query $query)
	{
		return ['form' => new ModuleHtmlAddForm($query)];
	}
}
