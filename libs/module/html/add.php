<?php

class Module_Html_Add extends Module_Html_Abstract
{
	use Trait_Module_Art;

	protected $js = array('external/upload', 'ajaxtip', 'add');
	protected $css = array('external/upload', 'ajaxtip', 'add');

	protected function get_params(Query $query) {
		$this->set_param('query', $query->to_url_string());
	}
}
