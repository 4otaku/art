<?php

namespace Otaku\Art;

class ModuleAjaxFilters extends ModuleAbstract
{
	use TraitOutputTpl;

	protected function get_params(Query $query)
	{
		$this->set_param('filter', Config::get('filter'));
		$this->set_param('content', Config::get('content'));
	}
}
