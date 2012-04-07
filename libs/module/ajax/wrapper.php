<?php

class Module_Ajax extends Module_Html_Abstract
{
	protected function get_modules(Query $query) {
		$url = $query->url();
		array_shift($url);

		if (empty($url)) {
			return array();
		}

		$class = implode('_', array_map('ucfirst', $url));
		$class = 'Module_Ajax_' . $class;

		if (!class_exists($class)) {
			if ($query->get('format') == 'json') {
				return array('body' =>
					new Module_Ajax_Json_Error($query));
			} else {
				return array();
			}
		}

		return array(
			'body' => new $class($query)
		);
	}
}
