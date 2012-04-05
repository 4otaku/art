<?php

class Module_Ajax_Plugin extends Module_Html_Abstract
{
	protected function get_params(Query $query)
	{
		$plugins = Database::get_full_table('plugin');

		foreach ($plugins as &$plugin) {
			$plugin['name'] = ucfirst($plugin['filename']);
		}

		$this->set_param('plugin', $plugins);
	}
}
