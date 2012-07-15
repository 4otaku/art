<?php

class Module_Html_Art_Search extends Module_Html_Art_Abstract
{
	protected $js = array('search');

	protected function get_params(Query $query) {
		$legal = $query->all();
		unset($legal['page']);
		$legal = array_keys($legal);

		$search = array();
		foreach ($query->get() as $key => $items) {
			if (!in_array($key, $legal)) {
				continue;
			}

			foreach ((array) $items as $item) {
				$search[] = $key == 'tag' ? $item : $key . ':' . $item;
			}
		}

		$this->set_param('query', implode(' ', $search));
	}
}
