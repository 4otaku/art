<?php

class Module_Content_Index extends Module_Html_Abstract
{
	protected $css = array('misc/search', 'content/index');
	protected $js = array('search');

	protected function get_modules(Query $query) {
		return array(
			'panel' => new Module_Content_Widget_Panel($query),
			'widget' => new Module_Content_Widget_Index($query)
		);
	}
}
