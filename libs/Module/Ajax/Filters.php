<?php

namespace Otaku\Art;

class Module_Ajax_Filters extends Module_Abstract
{
	use Trait_Output_Tpl;

	protected function get_params(Query $query)
	{
		$this->set_param('filter', Config::get('filter'));
		$this->set_param('content', Config::get('content'));
	}
}
