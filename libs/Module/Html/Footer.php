<?php

namespace Otaku\Art;

class Module_Html_Footer extends Module_Html_Abstract
{
	protected $css = array('base', 'footer');

	protected function get_params(Query $query)
	{
		$this->set_param('year', date('Y'));
	}
}
