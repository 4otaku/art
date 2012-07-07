<?php

class Module_Html_Part_Search extends Module_Html_Abstract
{
	protected $possible_keys = array(
		'tag', 'user', 'pack', 'group', 'artist',
		'manga', 'rating', 'sort', 'order', 'width',
		'height', 'weight', 'size', 'md5'
	);

	protected function get_params(Query $query)
	{
		$search = array();
		foreach ($query->get() as $key => $items) {
			if (!in_array($key, $this->possible_keys)) {
				continue;
			}

			foreach ((array) $items as $item) {
				$search[] = $key == 'tag' ? $item : $key . ':' . $item;
			}
		}

		$this->set_param('query', implode(' ', $search));
	}
}
