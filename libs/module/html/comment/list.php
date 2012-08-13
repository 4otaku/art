<?php

class Module_Html_Comment_List extends Module_Html_Abstract
{
	protected $css = array('comment');
	protected $js = array('comment');

	protected $is_tree = true;
	protected $per_page = 7;
	protected $reverse = true;
	protected $page = 1;
	protected $id = 0;

	public function __construct(Query $query, $disabled = false) {
		parent::__construct($query, $disabled);

		$this->reverse = (bool) Config::get('comment', 'reverse');
		$this->per_page = (int) Config::get('comment', 'per_page');
		$this->is_tree = (bool) Config::get('comment', 'tree');
	}

	protected function get_modules(Query $query) {
		return array(
			'list' => new Module_Html_Container('comment_item'),
			'paginator' => new Module_Html_Comment_Paginator($query)
		);
	}

	protected function get_params(Query $query)
	{
		if ($query->get('comment_page')) {
			$this->page = max($this->page,
				(int) $query->get('comment_page'));
		}

		if ($query->url(0)) {
			$this->id = (int) $query->url(0);
		}
	}

	protected function make_request() {
		if (empty($this->id)) {
			return false;
		}

		return new Request('comment', $this, array(
			'root_only' => (int) $this->is_tree,
			'add_tree' => (int) $this->is_tree,
			'sort_order' => $this->reverse ? 'desc' : 'asc',
			'page' => $this->page,
			'per_page' => $this->per_page,
			'filter' => array(
				'area' => 'art',
				'id_item' => $this->id
			)
		));
	}

	public function recieve_data($data) {
		$this->modules['paginator']->set_per_page($this->per_page)
			->set_page($this->page)->set_id($this->id)->recieve_data($data);

		$step = $this->reverse ? -1 : 1;
		$current = $this->reverse ? $data['count'] : 1;
		$current = $current + ($this->page - 1) * $this->per_page * $step;

		$comments = array();
		foreach ($data['data'] as $item) {
			$item['label'] = array($current);
			$current = $current + $step;

			if (isset($item['tree'])) {
				foreach ($item['tree'] as $child) {
					$comments[$child['id']] = $child;
				}
			}
			unset($item['tree']);

			$comments[$item['id']] = $item;
		}

		$break = 0;
		while ($this->have_unlabeled($comments) && ++$break < 50) {
			$this->set_labels_to($comments);
		}

		foreach ($comments as &$comment) {
			$comment['max_depth'] = $comment['depth'] =
				count($comment['label']) - 1;
		}
		foreach ($comments as &$comment) {
			if (!isset($comments[$comment['rootparent']])) {
				continue;
			}
			$root = &$comments[$comment['rootparent']];
			$root['max_depth'] = max($root['max_depth'], $comment['depth']);
		}
		unset($root);
		foreach ($comments as &$comment) {
			if (!isset($comments[$comment['rootparent']])) {
				continue;
			}
			$root = $comments[$comment['rootparent']];
			$comment['max_depth'] = $root['max_depth'];
		}

		usort($comments, array($this, 'label_sort'));

		foreach ($comments as $key => &$comment) {
			if ($this->is_tree) {
				$comment['label'] = implode('.', $comment['label']) . ')';
				$comment['list_mode'] = 0;
			} else {
				$comment['label'] = '';
				$comment['list_mode'] = 1;
			}
			$comment['date'] = Util_Date::format($comment['sortdate'], true);
			if (!empty($comment['editdate'])) {
				$comment['editdate'] = Util_Date::format($comment['editdate'], true);
			}
			$comment['text'] = new Text($comment['text']);
			$comment['text']->format();
			$comment['order'] = $key + 1;
		}
		unset($comment);

		$this->modules['list']->recieve_data($comments);
	}

	protected function have_unlabeled($comments) {
		foreach ($comments as $comment) {
			if (!isset($comment['label'])) {
				return true;
			}
		}

		return false;
	}

	protected function set_labels_to(&$comments) {
		foreach ($comments as &$comment) {
			if (isset($comment['label']) ||
				!isset($comments[$comment['parent']]['label'])) {
				continue;
			}

			$parent = &$comments[$comment['parent']];

			if (!isset($parent['links'])) {
				$parent['links'] = array();
			}
			$parent['links'][] = &$comment;
			usort($parent['links'], array($this, 'date_sort'));

			foreach ($parent['links'] as $key => &$child) {
				$label = $parent['label'];
				$label[] = $key + 1;
				$child['label'] = $label;
			}
		}
	}

	protected function date_sort($a, $b) {
		return strtotime($a['sortdate']) > strtotime($b['sortdate']) ?
			1 : -1;
	}

	protected function label_sort($a, $b) {
		$i = 0;
		$count_a = count($a['label']);
		$count_b = count($b['label']);
		while ($i < $count_a && $i < $count_b) {
			if ($a['label'][$i] != $b['label'][$i]) {
				$return = $a['label'][$i] > $b['label'][$i] ? 1 : -1;
				return $this->reverse ? $return * -1 : $return;
			}
			$i++;
		}

		return $count_a > $count_b ? 1 : -1;
	}
}
