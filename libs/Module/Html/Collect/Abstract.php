<?php

namespace Otaku\Art;

use Otaku\Framework\Query;

abstract class ModuleHtmlCollectAbstract extends ModuleHtmlArtAbstract
{
	protected $valid_types = ['parent', 'group', 'pack', 'manga', 'artist'];

	protected function is_valid()
	{
		list($type, $value, $parsed) = $this->get_collect_params();

		return count($parsed) == 1 &&
			in_array($type, $this->valid_types) &&
			empty($value['not']) &&
			empty($value['more']) &&
			empty($value['less']) &&
			!empty($value['is']) &&
			count($value['is']) == 1;
	}

	protected function get_collect_params()
	{
		$query = $this->get_query();
		$parsed = $query->parsed();
		$type = key($parsed);
		$value = reset($parsed);

		return [$type, $value, $parsed];
	}

	protected function get_params(Query $query) {
		list($type, $value) = $this->get_collect_params();
		$this->set_param('type', $type);
		$this->set_param('value', $value['is'][0]);
	}
}
