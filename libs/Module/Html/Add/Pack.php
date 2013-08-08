<?php

namespace Otaku\Art;

class ModuleHtmlAddPack extends ModuleHtmlAddPool
{
	protected function get_modules(Query $query)
	{
		return ['form' => new ModuleHtmlAddForm($query)];
	}
}
