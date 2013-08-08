<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Query;

class HtmlAddGroup extends HtmlAddPool
{
	protected function get_modules(Query $query)
	{
		return ['form' => new HtmlAddForm($query)];
	}
}
