<?php

namespace Otaku\Art;

abstract class Module_Html_Add_Pool extends Module_Html_Abstract
{
	use Trait_Module_Art;

	protected $js = ['external/wysibb', 'wysibb', 'ajaxtip',
		'addcommon', 'addpool'];
	protected $css = ['ajaxtip', 'addpool'];

	protected function get_modules(Query $query)
	{
		return ['form' => new Module_Html_Add_Form($query)];
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
