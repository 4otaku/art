<?php

class Module_Download extends Module_Abstract
{
	protected function get_modules(Query $query) {
		$type = (string) $query->get('type');
		$type = explode('_', $type);
		$type = implode('_', array_map('ucfirst', $type));
		$class = 'Module_Download_' . $type;

		if (!class_exists($class)) {
			return [];
		}

		return array['body' => new $class($query)];
	}
}
