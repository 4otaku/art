<?php

namespace Otaku\Art;

use Otaku\Framework\ModuleAbstract;
use Otaku\Framework\TraitOutputTpl;
use Otaku\Framework\Query;
use Otaku\Framework\Config;

class ModuleAjaxFilters extends ModuleAbstract
{
	use TraitOutputTpl;

	protected function get_params(Query $query)
	{
		$this->set_param('filter', Config::get('filter'));
		$this->set_param('content', Config::get('content'));
	}
}
