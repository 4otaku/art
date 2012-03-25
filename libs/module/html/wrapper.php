<?php

class Module_Html extends Module_Html_Abstract
{
	protected $css = array('reset');
	protected $js = array('external/jquery.min');

	protected function get_modules(Query $query) {
		if ($query->url(0) == 'slideshow') {
			return array(
				'body' => new Module_Html_Slideshow($query)
			);
		}

		return array(
			'header' => new Module_Html_Header($query),
			'body' => new Module_Html_Body($query),
			'footer' => new Module_Html_Footer($query)
		);
	}
}
