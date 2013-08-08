<?php

namespace Otaku\Art;

class ModuleHtmlComment extends ModuleHtmlAbstract
{
	protected function get_modules(Query $query) {
		return array(
			'list' => new ModuleHtmlCommentList($query),
			'form' => new ModuleHtmlCommentForm($query)
		);
	}
}


