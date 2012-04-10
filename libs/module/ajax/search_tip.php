<?php

class Module_Ajax_Search_Tip extends Module_Ajax_Json
{
	private $_meta_tips = array('post', 'video', 'art');

	protected function get_params(Query $query)
	{
		$search = $query->get('val');
		$area = $query->get('area');

		$search = Transform_Text::format_search($search);
		$area = explode(',', $area);

		if (empty($search) || empty($area)) {
			$this->error_code = 420;
			return;
		}

		$length = preg_match_all('/./u', $search, $dev_null);
		$where = 'and (' . implode('>0 or ', $area) . '> 0)';

		$tmp_area = $area;
		$order = new Database_Sorter(array_shift($tmp_area));
		foreach ($tmp_area as $item) {
			$order->add_operation('sum', $item);
		}

		$single = reset($area);
		if (count($area) != 1 || !in_array($single, $this->_meta_tips)) {
			$return = array();
		} else {
			$return = $this->get_meta_queries($single, $length, $search);
		}

		$queries = Database::order($order)->limit(10 - count($return))
			->get_vector('search_queries', array('id', 'query'),
			'(Left(query, ?) = ? '.$where.')',
			array($length, $search));

		foreach ($queries as $one) {
			$return[] = array('query' => $one,
				'alias' => $one,
				'type' => 'search');
		}

		shuffle($return);

		foreach ($return as &$one) {

			switch ($one['type']) {
				case 'tag':
					$one['query'] = "Тег: ".$one['query'];
					break;
				case 'category':
					$one['query'] = "Категория: ".$one['query'];
					break;
				case 'language':
					$one['query'] = "Язык: ".$one['query'];
					break;
				default: break;
			}

			if ($one['type'] != 'search') {
				$one['alias'] = '/'.$single.'/'.$one['type'].'/'.$one['alias'].'/';
			}
		}

		$this->success = true;
		$this->params = array(
			'data' => $return,
			'query' => $query->get('val')
		);
	}

	protected function get_meta_queries($area, $length, $search) {
		$return = array();

		$meta = array();

		$field = $area.'_main';
		$params = array($length, $search, '|'.$search);
		$meta['tag'] = Database::get_vector('tag',
			'`id`, `alias`, `name` as query',
				'(Left(name, ?) = ? or locate(?, t.variants))
				and '.$field.' > 0
				order by '.$field.' desc limit 2',
			$params
		);

		$params = array($length, $search,
			$length, $search, '|'.$area.'|');
		$meta['category'] = Database::get_vector('category',
			'`id`, `alias`, `name` as query',
				'(Left(alias , ?) = ? or Left(name, ?) = ?)
				 and locate(?, c.area) limit 2',
			$params
		);

		$params = array($length, $search,
			$length, $search);
		$meta['language'] = Database::get_vector('language',
			'`id`, `alias`, `name` as query',
			'Left(alias , ?) = ? or Left(name, ?) = ? limit 2',
			$params
		);

		foreach ($meta as $key => $one) {
			foreach ((array) $one as $variant) {
				$variant['type'] = $key;
				$return[] = $variant;
			}
		}

		return $return;
	}
}
