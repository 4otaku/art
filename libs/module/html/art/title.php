<?php

namespace otaku\art;

class Module_Html_Art_Title extends Module_Html_Art_Abstract
{
	use Trait_File;

	protected $sort_variants = array(
		'none' => 'без сортировки',
		'random' => 'в случайном порядке',
		'date' => 'в порядке даты добавления',
		'width' => 'сортировка по ширине',
		'height' => 'сортировка по высоте',
		'weight' => 'сортировка по весу файла',
		'size' => 'сортировка по числу пикселей',
		'rating' => 'сортировка по рейтингу',
		'parent_order' => 'сортировка по номеру вариации',
		'comment_count' => 'сортировка по числу комментариев',
		'comment_date' => 'в порядке времени последнего комментария',
		'tag_count' => 'сортировка по числу тегов',
		'translation_date' => 'в порядке времени последнего перевода'
	);
	protected $mode_variants = array(
		'comment' => 'прокомментированные арты',
		'translation' => 'переведенные арты',
		'pack' => 'CG-паки',
		'group' => 'группы',
		'manga' => 'манга',
		'artist' => 'галереи художников',
	);
	protected $tagged_variants = array(
		'no' => 'непротеганное',
		'all' => 'вне зависимости от тегов',
	);
	protected $approved_variants = array(
		'no' => 'барахолка',
		'waiting' => 'очередь премодерации',
		'yes_or_waiting' => 'кроме забракованных',
		'all' => 'вне зависимости от одобрения',
	);

	protected $request = null;
	protected $search = array();

	protected function get_params(Query $query) {
		$search = array();

		$other = $query->other();
		$parsed = $query->parsed(false);

		if ($query->get_pool_mode()) {
			$search[] = array($query->get_pool_mode() =>
				$query->get_pool_value());
		} elseif ($query->mode() != 'art') {
			$search[] = array('mode' => $query->mode());
		} else {
			if (!empty($other['approved']) && $other['approved'] != 'yes') {
				$search[] = array('approved' => $other['approved']);
			}
			if (!empty($other['tagged']) && $other['tagged'] != 'yes') {
				$search[] = array('tagged' => $other['tagged']);
			}
		}

		foreach ($parsed as $key => $data) {
			if (!empty($data['is'])) {
				$search[] = array($key . '_is' => $data['is']);
			}
		}
		foreach ($parsed as $key => $data) {
			if (!empty($data['more'])) {
				$search[] = array($key . '_more' => $data['more']);
			}
		}
		foreach ($parsed as $key => $data) {
			if (!empty($data['less'])) {
				$search[] = array($key . '_less' => $data['less']);
			}
		}
		foreach ($parsed as $key => $data) {
			if (!empty($data['not'])) {
				$search[] = array($key . '_not' => $data['not']);
			}
		}

		$other['sort'] = empty($other['sort']) ? 'date' : $other['sort'];
		$other['order'] = empty($other['order']) ? 'desc' : $other['order'];
		if ($other['order'] != 'desc' || $other['sort'] != 'date') {
			$search[] = array('sort' => $other['sort']);
			if ($other['sort'] != 'none' && $other['sort'] != 'random') {
				$search[] = array('order' => $other['order']);
			}
		}

		$primary = true;
		foreach ($search as &$part) {
			$value = reset($part);
			$function = 'word_' . key($part);
			if (is_callable(array($this, $function))) {
				$part = $this->$function($value, $primary);
				if ($primary) {
					$part = $this->primary_transform($part);
				}
				$primary = false;
			} else {
				$part = null;
			}
		}

		$this->search = array_filter($search);

		if ($this->request === null) {
			$this->set_param('query', implode(', ', $this->search));
		}
	}

	protected function make_request() {
		if ($this->request !== null) {
			return $this->request;
		}
		return array();
	}

	public function recieve_data($data) {
		if (!empty($data['data']['title'])) {
			$this->search[0] .= $data['data']['title'];
		} elseif (!empty($data['data']['artist'])) {
			$this->search[0] .= $data['data']['artist'];
		} else {
			$this->search[0] .= '(не найдено)';
		}

		if (!empty($data['data']['weight'])) {
			$this->set_param('weight', $this->format_weight($data['data']['weight']));
			$this->set_param('pool_mode', $this->get_query()->get_pool_mode());
			$this->set_param('pool_value', $this->get_query()->get_pool_value());
		}

		if (!empty($data['data']['text'])) {
			$text = new Text($data['data']['text']);
			$text->format();
			$this->set_param('text', $text);
		}

		$this->set_param('query', implode(', ', $this->search));
	}

	protected function primary_transform($part) {
		return preg_replace_callback('/^(.)(.*)/ui', function ($match) {
			return mb_strtoupper($match[1]) . $match[2];
		}, $part);
	}

	protected function word_group($data, $primary = false) {
		$this->request = new Request_Item('art_group', $this, array('id' => $data));
		return 'Группа ';
	}

	protected function word_pack($data, $primary = false) {
		$this->request = new Request_Item('art_pack', $this, array('id' => $data));
		return 'CG-пак ';
	}

	protected function word_manga($data, $primary = false) {
		$this->request = new Request_Item('art_manga', $this, array('id' => $data));
		return 'Манга ';
	}

	protected function word_artist($data, $primary = false) {
		$this->request = new Request_Item('art_artist', $this, array('id' => $data));
		return 'Галерея ';
	}

	protected function word_approved($data, $primary = false) {
		if (!array_key_exists($data, $this->approved_variants)) {
			return false;
		}

		return $this->approved_variants[$data];
	}

	protected function word_tagged($data, $primary = false) {
		if (!array_key_exists($data, $this->tagged_variants)) {
			return false;
		}

		return $this->tagged_variants[$data];
	}

	protected function word_mode($data, $primary = false) {
		if (!array_key_exists($data, $this->mode_variants)) {
			return false;
		}

		return $this->mode_variants[$data];
	}

	protected function word_user_is($data, $primary = false) {
		return 'загружено ' . implode(', ', $data);
	}

	protected function word_parent_is($data, $primary = false) {
		return 'вариации на арт №' . reset($data);
	}

	protected function word_user_not($data, $primary = false) {
		return 'кроме загруженых ' . implode(' или ', $data);
	}

	protected function word_translator_is($data, $primary = false) {
		return 'переведено ' . implode(', ', $data);
	}

	protected function word_translator_not($data, $primary = false) {
		return 'кроме переведенных ' . implode(' или ', $data);
	}

	protected function word_tag_is($data, $primary = false) {
		$return = ($primary ?
			(count($data) > 1 ? 'Теги ' : 'Тег ') :
			(count($data) > 1 ? 'с тегами ' : 'с тегом ')
		) . implode(', ', $data);
		return preg_replace('/^(.*),/ui', '$1 и', $return);
	}

	protected function word_tag_not($data, $primary = false) {
		$return = (count($data) > 1 ? 'без тегов ' : 'без тега ')
			. implode(', ', $data);
		return preg_replace('/^(.*),/ui', '$1 и', $return);
	}

	protected function word_rating_is($data, $primary = false) {
		return ($primary ? 'Рейтинг ' : 'с рейтингом ') .
			implode(' и ', $data);
	}

	protected function word_rating_more($data, $primary = false) {
		return ($primary ? 'Рейтинг больше ' : 'с рейтингом большим ') .
			implode(' и ', $data);
	}

	protected function word_rating_less($data, $primary = false) {
		return ($primary ? 'Рейтинг меньше ' : 'с рейтингом меньшим ') .
			implode(' и ', $data);
	}

	protected function word_rating_not($data, $primary = false) {
		return ($primary ? 'Рейтинг не равен ' : 'с рейтингом не равным ') .
			implode(' или ', $data);
	}

	protected function word_order($data, $primary = false) {
		return $data == 'asc' ? 'по возрастанию' : 'по убыванию';
	}

	protected function word_sort($data, $primary = false) {
		if (!array_key_exists($data, $this->sort_variants)) {
			return false;
		}

		return $this->sort_variants[$data];
	}

	protected function word_md5_is($data, $primary) {
		return 'с md5 ' . implode(' и ', $data);
	}
}
