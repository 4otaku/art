<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\HtmlAbstract;
use Otaku\Framework\Query;

class HtmlComment extends HtmlAbstract
{
	protected function get_modules(Query $query) {
		return array(
			'list' => new HtmlCommentList($query),
			'form' => new HtmlCommentForm($query)
		);
	}
}


