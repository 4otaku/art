<?php

class Module_Html_Header extends Module_Html_Abstract
{
	/*
	protected $css = array('reset');
	protected $js = array('jquery.min');

	protected function get_modules(Query $query)
	{
		if ($query->url(0) == 'slideshow') {
			return array(
				'body' => new Module_Html_Slideshow($query);
			}
		}

		return array(
			'header' => new Module_Html_Header($query),
			'body' => new Module_Html_Body($query)
		);
	}
	*/

	protected function make_request() {
		return new Request('head_menu', $this);
	}

	public function recieve_data($data) {
//		var_dump($data);
	}
}
