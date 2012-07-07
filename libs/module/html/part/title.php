<?php

class Module_Html_Part_Title extends Module_Html_Abstract
{
	protected $numeric_keys = array(
		'rating', 'width', 'height', 'weight', 'size'
	);

	protected $string_keys = array(
		'tag', 'user', 'pack', 'group', 'artist', 'manga', 'md5'
	);

	protected function get_params(Query $query) {
		$search = array();
		foreach ($query->get() as $key => $items) {
			$is_numeric = in_array($key, $this->numeric_keys);
			$is_string = in_array($key, $this->string_keys);

			if (!$is_numeric && !$is_string) {
				continue;
			}

			list($is, $not, $more, $less) =
				$this->parse((array) $items, $is_numeric);
		}

		$this->set_param('query', implode(' ', $search));
	}

	protected function parse($items, $is_numeric) {
		$is = $not = $more = $less = array();
		foreach ($items as $item) {
			if (strpos('!', $item) === 0) {
				$not[] = substr($item, 1);
				continue;
			}
			if (strpos('>', $item) === 0 && $is_numeric) {
				$more[] = substr($item, 1);
				continue;
			}
			if (strpos('<', $item) === 0 && $is_numeric) {
				$less[] = substr($item, 1);
				continue;
			}
			$is[] = $item;
		}
		return array($is, $not, $more, $less);
	}
}
