<?php

class Module_Html_Slideshow extends Module_Html_Abstract
{
	use Trait_Module_Art;

	protected $js = array('slideshow', 'image', 'translation');
	protected $css = array('item', 'slideshow');

	protected function get_params(Query $query) {
		$this->set_param('query', $query->to_url_string());
		$this->set_param('start', max(1, $query->get('start')));
	}
}
