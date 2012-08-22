<?php

class Module_Html_Slideshow extends Module_Html_Art_Abstract
{
	protected $js = array('external/slideshow_plugins', 'slideshow');
	protected $css = array('external/slideshow_plugins', 'slideshow');

	protected function get_params(Query $query) {
		$this->set_param('query', $query->to_url_string());
	}
}
