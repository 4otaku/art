<?php

namespace Otaku\Art;

class ModuleAjaxPlugin extends ModuleAbstract
{
	use TraitOutputTpl;

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
