<?php

namespace Otaku\Art;

use Otaku\Framework\ModuleAbstract;
use Otaku\Framework\TraitOutputTpl;
use Otaku\Framework\Query;
use Otaku\Framework\Database;

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
