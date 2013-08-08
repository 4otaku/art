<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\Base;
use Otaku\Framework\TraitOutputTpl;
use Otaku\Framework\Query;
use Otaku\Framework\Config;

class AjaxFilters extends Base
{
	use TraitOutputTpl;

	protected function get_params(Query $query)
	{
		$this->set_param('filter', Config::get('filter'));
		$this->set_param('content', Config::get('content'));
	}
}
