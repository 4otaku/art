<?php

class Module_Html_Body extends Module_Html_Abstract
{
	protected $css = array('base');

	protected function get_modules(Query $query)
	{
		if ($query->url(0) == 'index') {
			return new Module_Content_Index($query);
		}

		if ($query->url(0) == 'art') {
			return array(
				new Module_Html_Sidebar($query, true),
				new Module_Content_Art($query)
			);
		}

		$class = 'Module_Content_' . $query->url(0);

		if (!class_exists($class)) {
			$class = 'Module_Content_Error';
		}

		return array(
			new $class($query),
			new Module_Html_Sidebar($query)
		);
	}
}
