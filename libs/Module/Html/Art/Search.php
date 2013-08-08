<?php

namespace Otaku\Art;

use Otaku\Framework\Query;

class ModuleHtmlArtSearch extends ModuleHtmlArtAbstract
{
	protected $js = array('ajaxtip', 'search');
	protected $css = array('ajaxtip', 'search');

	protected function get_params(Query $query) {
		$legal = $query->all();
		unset($legal['page']);
		$legal = array_keys($legal);

		$search = array();
		foreach ($query->get() as $key => $items) {
			$negated = '';
			if (strpos($key, '-') === 0) {
				$key = substr($key, 1);
				$negated = '-';
			}

			if (!in_array($key, $legal)) {
				continue;
			}

			foreach ((array) $items as $item) {
				$search[] = $negated .
					($key == 'tag' ? $item : $key . ':' . $item);
			}
		}

		// Если отдельный арт, то добавим страницу на которой он был
		if ($query->get('pos')) {
			$page = ceil($query->get('pos') / $query->per_page());
			if ($page > 1) {
				$search[] = 'page:' . $page;
			}
		}

		$this->set_param('query', implode(' ', $search));
	}
}
