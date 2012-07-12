<?php

class Module_Html_Art_Search extends Module_Html_Art_Abstract
{
	protected function get_params(Query $query) {
		$search = array();
		foreach ($query->get() as $key => $items) {
			if (!array_key_exists($key, $query->all())) {
				continue;
			}

			foreach ((array) $items as $item) {
				$search[] = $key == 'tag' ? $item : $key . ':' . $item;
			}
		}

		$this->set_param('query', implode(' ', $search));
	}
}
