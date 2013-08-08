<?php

namespace Otaku\Art;

class ModuleHtmlAddGroup extends ModuleHtmlAddPool
{
	protected function get_modules(Query $query)
	{
		return ['form' => new ModuleHtmlAddForm($query)];
	}
}
