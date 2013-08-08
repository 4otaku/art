<?php

namespace Otaku\Art;

use Otaku\Framework\Query;

class ModuleHtmlCollect extends ModuleHtmlCollectAbstract
{
	protected $css = ['collect'];

	protected function get_modules(Query $query)
	{
		$valid = $this->is_valid();

		return [
			'title' => new ModuleHtmlCollectTitle($query, !$valid),
			'search' => new ModuleHtmlCollectSearch($query, !$valid),
			'add' => new ModuleHtmlCollectAdd($query, !$valid),
			'error' => new ModuleHtmlCollectError($query, $valid)
		];
	}
}
