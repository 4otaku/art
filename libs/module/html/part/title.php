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

			$data = array();
			list($data['is'], $data['not'], $data['more'], $data['less']) =
				$this->parse((array) $items, $is_numeric);
			$data_key = (int) 1000 * (count($data['is']) * 1000 + count($data['more']) * 100 +
				count($data['less']) * 10 + count($data['not']) + rand()/getrandmax());
			while (isset($search[$data_key])) {
				$data_key++;
			}
			$search[$data_key] = array('data' => $data, 'type' => $key);
		}

		krsort($search);

		$primary = true;
		foreach ($search as &$item) {
			$part = array();
			foreach ($item['data'] as $key => $data) {
				if (!empty($data)) {
					$function = 'word_for_' . $item['type'];
					list($word, $separator) = $this->$function($primary, $key, count($data) > 1);
					$part[] = $word . ' ' . implode($separator, $data);
					$primary = false;
				}
			}
			$item = implode(', ', $part);
		}

		$this->set_param('query', implode(', ', $search));
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

	protected function word_for_rating($primary, $type, $multi) {
		switch ($type) {
			case 'is': $postfix = $primary ? ' равен' : ' равным'; break;
			case 'more': $postfix = $primary ? ' больше' : ' больше чем'; break;
			case 'less': $postfix = $primary ? ' меньше' : ' меньше чем'; break;
			case 'not': $postfix = $primary ? ' не равен' : ' не равным'; break;
		}
		return array(($primary ? 'Рейтинг' : 'с рейтингом') . $postfix, ' и ');
	}

	protected function word_for_width($primary, $type, $multi) {
		switch ($type) {
			case 'is': $postfix = $primary ? ' равна' : ' равной'; break;
			case 'more': $postfix = $primary ? ' больше' : ' большей'; break;
			case 'less': $postfix = $primary ? ' меньше' : ' меньшей'; break;
			case 'not': $postfix = $primary ? ' не равна' : ' не равной'; break;
		}
		return array(($primary ? 'Ширина' : 'с шириной') . $postfix, ' и ');
	}

	protected function word_for_height($primary, $type, $multi) {
		switch ($type) {
			case 'is': $postfix = $primary ? ' равна' : ' равной'; break;
			case 'more': $postfix = $primary ? ' больше' : ' большей'; break;
			case 'less': $postfix = $primary ? ' меньше' : ' меньшей'; break;
			case 'not': $postfix = $primary ? ' не равна' : ' не равной'; break;
		}
		return array(($primary ? 'Высота' : 'с высотой') . $postfix, ' и ');
	}

	protected function word_for_weight($primary, $type, $multi) {
		switch ($type) {
			case 'is': $postfix = ' равным'; break;
			case 'more': $postfix = ' больше чем'; break;
			case 'less': $postfix = ' меньше чем'; break;
			case 'not': $postfix = ' не равным'; break;
		}
		return array(($primary ? 'Весом' : 'с весом') . $postfix, ' и ');
	}

	protected function word_for_size($primary, $type, $multi) {
		switch ($type) {
			case 'is': $postfix = ' равным'; break;
			case 'more': $postfix = ' большим'; break;
			case 'less': $postfix = ' меньшим'; break;
			case 'not': $postfix = ' не равным'; break;
		}
		return array(($primary ? 'Размером' : 'с размером') . $postfix, ' и ');
	}

	protected function word_for_tag($primary, $type, $multi) {
		$word = $primary ?
			($type == 'is' ? ($multi ? 'Теги' : 'Тег') : ($multi ? 'Без тегов' : 'Без тега')) :
			($type == 'is' ? ($multi ? 'с тегами' : 'с тегом') : ($multi ? 'без тегов' : 'без тега'));
		return array($word, ' и ');
	}

	protected function word_for_user($primary, $type, $multi) {
		$word = $primary ?
			($type == 'is' ? 'Загружен' : 'Загружен не') :
			($type == 'is' ? 'загружен' : 'загружен не');
		return array($word, ' и ');
	}

	protected function word_for_pack($primary, $type, $multi) {
		$word = $primary ?
			($type == 'is' ? ($multi ? 'В паках' : 'В паке') : ($multi ? 'Не в паках' : 'Не в паке')) :
			($type == 'is' ? ($multi ? 'в паках' : 'в паке') : ($multi ? 'не в паках' : 'не в паке'));
		return array($word, ' и ');
	}

	protected function word_for_group($primary, $type, $multi) {
		$word = $primary ?
			($type == 'is' ? ($multi ? 'В группах' : 'В группе') : ($multi ? 'Не в группах' : 'Не в группе')) :
			($type == 'is' ? ($multi ? 'в группах' : 'в группе') : ($multi ? 'не в группах' : 'не в группе'));
		return array($word, ' и ');
	}

	protected function word_for_artist($primary, $type, $multi) {
		$word = $primary ?
			($type == 'is' ? 'В галерее' : ($multi ? 'Не в галереях' : 'Не в галерее')) :
			($type == 'is' ? 'в галерее' : ($multi ? 'не в галереях' : 'не в галерее'));
		return array($word, ' и ');
	}

	protected function word_for_manga($primary, $type, $multi) {
		$word = $primary ?
			($type == 'is' ? 'Страницы манги' :  ($multi ? 'Не в мангах' : 'Не в манге')) :
			($type == 'is' ? 'в манге' : ($multi ? 'не в мангах' : 'не в манге'));
		return array($word, ' и ');
	}

	protected function word_for_md5($primary, $type, $multi) {
		return array('md5', ' и ');
	}
}
