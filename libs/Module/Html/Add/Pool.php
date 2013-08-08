<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\HtmlAbstract;
use Otaku\Framework\Query;
use Otaku\Art\TraitModuleArt;

abstract class HtmlAddPool extends HtmlAbstract
{
	use TraitModuleArt;

	protected $js = ['external/wysibb', 'wysibb', 'ajaxtip',
		'addcommon', 'addpool'];
	protected $css = ['ajaxtip', 'addpool'];

	protected function get_modules(Query $query)
	{
		return ['form' => new HtmlAddForm($query)];
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
