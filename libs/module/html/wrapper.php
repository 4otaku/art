<?php

class Module_Html extends Module_Html_Abstract
{
	protected $css = array('reset');
	protected $js = array('external/jquery.min', 'external/common_plugins', 'base');

	protected function get_params(Query $query) {
		$plugins = Database::get_vector('plugin', array('id', 'filename'));
		$enabled = (array) Config::get('plugins');

		foreach ($plugins as $id => $plugin) {
			if (!empty($enabled[$id])) {
				$this->js[] = 'plugins/' . $plugin;
			}
		}
	}

	protected function get_modules(Query $query) {
		if ($query->url(0) == 'slideshow') {
			return array(
				'body' => new Module_Html_Slideshow($query)
			);
		}

		return array(
			'header' => new Module_Html_Part_Header($query),
			'body' => new Module_Html_Body($query),
			'footer' => new Module_Html_Part_Footer($query)
		);
	}
}
