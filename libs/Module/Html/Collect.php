<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Query;

class HtmlCollect extends HtmlCollectAbstract
{
	protected $css = ['collect'];

	protected function get_modules(Query $query)
	{
		$valid = $this->is_valid();

		return [
			'title' => new HtmlCollectTitle($query, !$valid),
			'search' => new HtmlCollectSearch($query, !$valid),
			'add' => new HtmlCollectAdd($query, !$valid),
			'error' => new HtmlCollectError($query, $valid)
		];
	}
}
