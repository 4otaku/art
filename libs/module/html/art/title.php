<?php

class Module_Html_Art_Title extends Module_Html_Art_Abstract
{
	protected function get_params(Query $query) {
		$primary = true;
		$search = array();
		foreach ($query->parsed() as $key => $data) {
			$part = array();
			foreach ($data as $type => $items) {
				if (!empty($items)) {
					$function = 'word_for_' . $key;
					list($word, $separator) = $this->$function($primary, $type, count($items) > 1);
					$part[] = $word . ' ' . implode($separator, $items);
					$primary = false;
				}
			}
			$search[] = implode(', ', $part);
		}

		$this->set_param('query', implode(', ', $search));
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
