<?php

class Module_Html_Slideshow extends Module_Html_Art_Abstract
{
	protected $js = array('slideshow');
	protected $css = array('slideshow');

	protected function get_params(Query $query) {
		$this->set_param('query', $query->to_url_string());
	}
}
