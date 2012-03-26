<?php

class Module_Ajax extends Module_Html_Abstract
{
	protected function get_modules(Query $query) {
		$url = $query->url();
		array_shift($url);

		if (empty($url)) {
			return false;
		}

		$class = implode('_', array_map('ucfirst', $url));
		$class = 'Module_Ajax_' . $class;

		if (!class_exists($class)) {
			return false;
		}

		return array(
			'body' => new $class($query)
		);
	}
}
