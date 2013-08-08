<?php

namespace Otaku\Art;

use Otaku\Framework\Query;

class ModuleHtmlAddPack extends ModuleHtmlAddPool
{
	protected function get_modules(Query $query)
	{
		return ['form' => new ModuleHtmlAddForm($query)];
	}
}
