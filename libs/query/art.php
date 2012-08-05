<?php

class Query_Art extends Query
{
	protected $parsed = array();
	protected $other = array();
	protected $forced_per_page = true;
	protected $pool_mode = false;
	protected $comparable_keys = array(
		'rating', 'width', 'height', 'weight', 'date', 'translation_date',
		'tag_count', 'comment_count', 'comment_date'
	);
	protected $equal_keys = array(
		'tag', 'user', 'pack', 'group', 'artist',
		'manga', 'md5', 'parent', 'translator'
	);
	protected $other_keys = array(
		'sort', 'order', 'mode', 'page', 'per_page',
		'approved', 'tagged', 'variations'
	);
	protected $possible_modes = array(
		'art', 'comment', 'translation', 'pack', 'group', 'manga', 'artist'
	);
	protected $pool_keys = array(
		'pack', 'group', 'artist', 'manga'
	);
	protected $legal_sort = array(
		'none', 'random', 'date', 'width', 'height', 'weight', 'size',
		'rating', 'parent_order', 'comment_count', 'comment_date',
		'tag_count', 'translation_date'
	);

	public function __construct($url, $get = array(), $clean = true) {
		parent::__construct($url, $get, $clean);

		$search = array();
		$pool_count = 0;
		foreach ($this->get() as $key => $items) {
			$is_comparable = in_array($key, $this->comparable_keys);
			$is_equal = in_array($key, $this->equal_keys);
			$is_other = in_array($key, $this->other_keys);
			$is_pool = in_array($key, $this->pool_keys);

			if (!$is_comparable && !$is_equal) {
				if ($is_other) {
					$item = is_array($items) ? reset($items) : $items;
					if ($key == 'mode' && !in_array($item, $this->possible_modes)) {
						continue;
					}
					$this->other[$key] = $item;
				}
				continue;
			}

			$data = array();
			list($data['is'], $data['not'], $data['more'], $data['less']) =
				$this->parse((array) $items, $is_comparable);
			$search[] = array('data' => $data, 'type' => $key);

			if ($is_pool && $pool_count !== false) {
				if (!empty($data['not']) || !empty($data['more']) || !empty($data['less'])) {
					$pool_count = false;
				} else {
					$pool_count += count($data['is']);
					$this->pool_mode = $key;
				}
			}
		}

		if ($pool_count !== 1) {
			$this->pool_mode = false;
		}

		if (empty($this->other['per_page'])) {
			$this->other['per_page'] = Config::get('pp', 'art');
			$this->forced_per_page = false;
		}

		if (!empty($this->other['sort']) && !in_array($this->other['sort'], $this->legal_sort)) {
			unset($this->other['sort']);
		}

		ksort($this->other);
		foreach ($search as $item) {
			$this->parsed[$item['type']] = $item['data'];
		}
	}

	public function parsed($add_pool_items = true) {
		$return = $this->parsed;
		if (!$add_pool_items) {
			foreach ($this->pool_keys as $key) {
				unset($return[$key]);
			}
		}
		return $return;
	}

	public function other() {
		return $this->other;
	}

	public function mode() {
		return isset($this->other['mode']) ? $this->other['mode'] :
			reset($this->possible_modes);
	}

	public function page() {
		return isset($this->other['page']) ? $this->other['page'] : 1;
	}

	public function per_page() {
		return $this->other['per_page'];
	}

	public function get_pool_mode() {
		return $this->pool_mode;
	}

	public function get_pool_value() {
		if(empty($this->pool_mode)) {
			return null;
		}

		return reset($this->parsed[$this->pool_mode]['is']);
	}

	public function to_url_string() {
		$parts = array();

		$params = $this->parsed();

		foreach ($params as $key => $param) {
			foreach ($param as $mode => $items) {
				switch ($mode) {
					case 'is': $mode = ''; break;
					case 'more': $mode = '>'; break;
					case 'less': $mode = '<'; break;
					case 'not': $mode = '!'; break;
				}
				foreach ($items as $item) {
					$parts[] = $key . '[]=' . $mode . $item;
				}
			}
		}

		$params = $this->other();
		unset($params['page']);
		if (!$this->forced_per_page) {
			unset($params['per_page']);
		}
		foreach ($params as $key => $param) {
			$parts[] = $key . '=' . $param;
		}

		return implode('&', $parts);
	}

	public function all() {
		return array_merge($this->parsed, $this->other);
	}

	protected function parse($items, $is_comparable) {
		$is = $not = $more = $less = array();
		foreach ($items as $item) {
			if (strpos($item, '!') === 0) {
				$not[] = substr($item, 1);
				continue;
			}
			if (strpos($item, '>') === 0 && $is_comparable) {
				$more[] = substr($item, 1);
				continue;
			}
			if (strpos($item, '<') === 0 && $is_comparable) {
				$less[] = substr($item, 1);
				continue;
			}
			$is[] = $item;
		}
		return array($is, $not, $more, $less);
	}
}
