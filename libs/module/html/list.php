<?php

class Module_Html_List extends Module_Html_Abstract
{
	protected $css = array('base');
	protected $js = array();

	protected function get_params(Query $query)
	{
	}

	protected function make_request() {
		return new Request('head_menu', $this);
	}
}
