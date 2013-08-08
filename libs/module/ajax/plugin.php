<?php

namespace otaku\art;

class Module_Ajax_Plugin extends Module_Abstract
{
	use Trait_Output_Tpl;

	protected function get_params(Query $query)
	{
		$plugins = Database::get_full_table('plugin');

		foreach ($plugins as &$plugin) {
			$plugin['name'] = ucfirst($plugin['filename']);
			$plugin['name'] = str_replace('_', ' ', $plugin['name']);
		}

		$this->set_param('plugin', $plugins);
	}
}
