<?php

abstract class Module_Content_Widget_Abstract extends Module_Html_Abstract
{
	protected $prefix = '';

	protected function get_widgets () {
		$return = array();

		$config = Config::get();
		$count = Config::get('panel', 'count');
		$prefix = $this->prefix . '_';

		foreach ($config as $key => $item) {
			if (stripos($key, $prefix) === 0) {
				$key = (int) str_replace($prefix, '', $key);
				if ($key <= $count) {
					$item['id'] = $key;
					$return[$key] = $item;
				}
			}
		}

		ksort($return);

		return array_values($return);
	}
}
