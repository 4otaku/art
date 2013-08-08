<?php

namespace Otaku\Art;

abstract class ModuleHtmlAddPool extends ModuleHtmlAbstract
{
	use TraitModuleArt;

	protected $js = ['external/wysibb', 'wysibb', 'ajaxtip',
		'addcommon', 'addpool'];
	protected $css = ['ajaxtip', 'addpool'];

	protected function get_modules(Query $query)
	{
		return ['form' => new ModuleHtmlAddForm($query)];
	}

	protected function get_params(Query $query)
	{
		$parsed = $query->parsed();

		if (!empty($parsed['tag']['is'])) {
			$this->set_param('tags', implode(' ', $parsed['tag']['is']) . ' ');
		} else {
			$this->set_param('tags', '');
		}
	}
}
