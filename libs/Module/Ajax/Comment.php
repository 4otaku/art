<?php

namespace Otaku\Art;

class ModuleAjaxComment extends ModuleAbstract
{
	use TraitOutputTpl;

	protected function get_modules(Query $query) {
		return new ModuleHtmlCommentList($query);
	}
}
