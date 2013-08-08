<?php

namespace Otaku\Art;

use Otaku\Framework\Query;
use Otaku\Framework\Config;

class QueryArt extends Query
{
	protected $parsed = [];
	protected $other = [];
	protected $forced_per_page = true;
	protected $per_page_all = false;
	protected $pool_mode = false;
	protected $comparable_keys = [
		'id', 'rating', 'width', 'height', 'weight', 'date',
		'translation_date', 'tag_count', 'comment_count', 'comment_date'
	];
	protected $equal_keys = [
		'tag', 'user', 'pack', 'group', 'artist',
		'manga', 'md5', 'parent', 'translator'
	];
	protected $other_keys = [
		'sort', 'order', 'mode', 'page', 'per_page',
		'approved', 'tagged', 'variations'
	];
	protected $possible_modes = [
		'art', 'comment', 'translation', 'pack', 'group', 'manga', 'artist'
	];
	protected $pool_keys = [
		'pack', 'group', 'artist', 'manga'
	];
	protected $legal_sort = [
		'none', 'random', 'date', 'width', 'height', 'weight', 'size',
		'rating', 'parent_order', 'comment_count', 'comment_date',
		'tag_count', 'translation_date'
	];

	public function __construct($url, $get = [], $clean = true) {
		parent::__construct($url, $get, $clean);

		$pool_count = 0;

		foreach ($this->get() as $key => $items) {
			$negated = false;
			if (strpos($key, '-') === 0) {
				$key = substr($key, 1);
				$negated = true;
			}

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

			list($is, $not, $more, $less) = $this->parse((array) $items,
				$is_comparable, $negated);
			if (!isset($this->parsed[$key])) {
				$this->parsed[$key] = ['is' => [], 'not' => [],
					'more' => [], 'less' => []];
			}

			$this->parsed[$key]['is'] =
				array_merge($this->parsed[$key]['is'], $is);
			$this->parsed[$key]['not'] =
				array_merge($this->parsed[$key]['not'], $not);
			$this->parsed[$key]['more'] =
				array_merge($this->parsed[$key]['more'], $more);
			$this->parsed[$key]['less'] =
				array_merge($this->parsed[$key]['less'], $less);

			if ($is_pool && $pool_count !== false) {
				if (!empty($not) || !empty($more) || !empty($less)) {
					$pool_count = false;
				} else {
					$pool_count += count($is);
					$this->pool_mode = $key;
				}
			}
		}

		if ($pool_count !== 1 || $this->is_pool_list()) {
			$this->pool_mode = false;
		}

		if (!empty($this->other['sort']) && !in_array($this->other['sort'], $this->legal_sort)) {
			unset($this->other['sort']);
		}

		ksort($this->other);

		if (isset($this->other['per_page']) && $this->other['per_page'] == 'all') {
			if ($this->get_pool_mode() || !empty($this->parsed['parent']['is'])) {
				$this->other['per_page'] = 999999;
				$this->per_page_all = true;
			} else {
				unset($this->other['per_page']);
			}
		}

		if (isset($this->other['per_page'])) {
			$this->other['per_page'] = (int) $this->other['per_page'];
		}

		if (empty($this->other['per_page'])) {
			if (
				isset($this->other['mode']) &&
				$this->other['mode'] == 'comment'
			) {
				$this->other['per_page'] = Config::get('art', 'per_page_comment');
			} else {
				$this->other['per_page'] = Config::get('art', 'per_page');
			}
			$this->forced_per_page = false;
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

	public function is_pool_list() {
		return isset($this->other['mode']) ?
			in_array($this->other['mode'], $this->pool_keys) : false;
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

	public function to_url_array() {
		$parts = [];
		$params = $this->parsed();

		foreach ($params as $key => $param) {
			foreach ($param as $mode => $items) {
				$sign = '';
				$negated = '';
				switch ($mode) {
					case 'is': break;
					case 'more': $sign = '>'; break;
					case 'less': $sign = '<'; break;
					case 'not': $negated = '-'; break;
					default: break;
				}
				foreach ($items as $item) {
					$parts[] = $negated . $key . '[]=' . $sign . $item;
				}
			}
		}

		$params = $this->other();
		unset($params['page']);
		if (!$this->forced_per_page || $this->per_page_all) {
			unset($params['per_page']);
		}
		foreach ($params as $key => $param) {
			$parts[] = $key . '=' . $param;
		}

		return $parts;
	}

	public function to_url_string() {
		return implode('&', $this->to_url_array());
	}

	public function all() {
		return array_merge($this->parsed, $this->other);
	}

	public function is_pool_full_view() {
		$parts = $this->to_url_array();
		return count($parts) == 1 && $this->get_pool_mode() &&
			empty($this->other['sort']) && $this->page() == 1 &&
			$this->per_page_all;
	}

	public function is_variation_list() {
		$parts = $this->to_url_array();
		return count($parts) == 3 && !$this->get_pool_mode() &&
			isset($this->other['sort']) &&
			$this->other['sort'] == 'parent_order' &&
			isset($this->other['order']) &&
			$this->other['order'] == 'asc' &&
			!empty($this->parsed['parent']) &&
			count($this->parsed['parent']['is']) == 1 &&
			count($this->parsed['parent']['not']) == 0 &&
			$this->page() == 1 && $this->per_page_all;
	}

	protected function parse($items, $is_comparable, $negated) {
		$is = $not = $more = $less = [];
		foreach ($items as $item) {
			if (strpos($item, '>') === 0 && $is_comparable) {
				if ($negated) {
					$less[] = substr($item, 1);
				} else {
					$more[] = substr($item, 1);
				}
				continue;
			}
			if (strpos($item, '<') === 0 && $is_comparable) {
				if ($negated) {
					$more[] = substr($item, 1);
				} else {
					$less[] = substr($item, 1);
				}
				continue;
			}
			if ($negated) {
				$not[] = $item;
			} else {
				$is[] = $item;
			}
		}
		return [$is, $not, $more, $less];
	}
}
