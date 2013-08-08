<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\Base;
use Otaku\Framework\Query;
use Otaku\Framework\TraitOutputTpl;

class AjaxComment extends Base
{
	use TraitOutputTpl;

	protected function get_modules(Query $query) {
		return new HtmlCommentList($query);
	}
}
