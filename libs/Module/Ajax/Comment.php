<?php

namespace Otaku\Art;

use Otaku\Framework\ModuleAbstract;
use Otaku\Framework\Query;
use Otaku\Framework\TraitOutputTpl;

class ModuleAjaxComment extends ModuleAbstract
{
	use TraitOutputTpl;

	protected function get_modules(Query $query) {
		return new ModuleHtmlCommentList($query);
	}
}
