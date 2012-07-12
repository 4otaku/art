<?php

class Query_Art extends Query
{
	protected $parsed = array();
	protected $other = array();
	protected $numeric_keys = array(
		'rating', 'width', 'height', 'weight', 'size'
	);
	protected $string_keys = array(
		'tag', 'user', 'pack', 'group', 'artist', 'manga', 'md5'
	);
	protected $other_keys = array(
		'sort', 'order'
	);

	public function __construct($url, $get = array(), $clean = true) {
		parent::__construct($url, $get, $clean);

		$search = array();
		foreach ($this->get() as $key => $items) {
			$is_numeric = in_array($key, $this->numeric_keys);
			$is_string = in_array($key, $this->string_keys);
			$is_other = in_array($key, $this->other_keys);

			if (!$is_numeric && !$is_string) {
				if ($is_other) {
					$this->other[$key] = is_array($items) ? reset($items) : $items;
				}
				continue;
			}

			$data = array();
			list($data['is'], $data['not'], $data['more'], $data['less']) =
				$this->parse((array) $items, $is_numeric);
			$data_key = count($data['is']) * 1000 + count($data['more']) * 100 +
				count($data['less']) * 10 + count($data['not']) + 10 * $is_string +
				array_search($key, $is_numeric ? $this->numeric_keys : $this->string_keys);
			while (isset($search[$data_key])) {
				$data_key++;
			}
			$search[$data_key] = array('data' => $data, 'type' => $key);
		}

		krsort($search);
		ksort($this->other);
		foreach ($search as $item) {
			$this->parsed[$item['type']] = $item['data'];
		}
	}

	public function parsed() {
		return $this->parsed;
	}

	public function other() {
		return $this->other;
	}

	public function all() {
		return array_merge($this->parsed, $this->other);
	}

	protected function parse($items, $is_numeric) {
		$is = $not = $more = $less = array();
		foreach ($items as $item) {
			if (strpos($item, '!') === 0) {
				$not[] = substr($item, 1);
				continue;
			}
			if (strpos($item, '>') === 0 && $is_numeric) {
				$more[] = substr($item, 1);
				continue;
			}
			if (strpos($item, '<') === 0 && $is_numeric) {
				$less[] = substr($item, 1);
				continue;
			}
			$is[] = $item;
		}
		return array($is, $not, $more, $less);
	}
}
