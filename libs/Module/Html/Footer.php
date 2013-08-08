<?php

namespace Otaku\Art;

use Otaku\Framework\ModuleHtmlAbstract;
use Otaku\Framework\Query;

class ModuleHtmlFooter extends ModuleHtmlAbstract
{
	protected $css = array('base', 'footer');

	protected function get_params(Query $query)
	{
		$this->set_param('year', date('Y'));
	}
}
