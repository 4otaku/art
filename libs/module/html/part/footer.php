<?php

class Module_Html_Part_Footer extends Module_Html_Abstract
{
	protected $css = array('base', 'footer');

	protected function get_params(Query $query)
	{
		$this->set_param('year', date('Y'));
	}
}
