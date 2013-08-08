<?php

namespace Otaku\Art;

class ModuleHtmlFooter extends ModuleHtmlAbstract
{
	protected $css = array('base', 'footer');

	protected function get_params(Query $query)
	{
		$this->set_param('year', date('Y'));
	}
}
