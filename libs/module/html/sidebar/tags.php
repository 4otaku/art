<?php

class Module_Html_Sidebar_Tags extends Module_Html_Abstract
{
	protected $css = array('sidebar');
	protected $js = array('sidebar');

	public function recieve_data($data) {
		usort($data, array($this, 'sort_tags'));

		$this->set_param('data', $data);
	}

	protected function sort_tags ($a, $b) {
		if (!is_array($a) || !is_array($b)) {
			return self::locale_natcmp($a, $b);
		}

		if (isset($a['name']) && isset($b['name'])) {
			return self::locale_natcmp($a['name'], $b['name']);
		}

		return 0;
	}

	protected function locale_natcmp ($a, $b) {
		preg_match('/(\p{Cyrillic})|(\p{Latin})|(\p{Hiragana}|\p{Katakana})/ui', $a, $a_index);
		preg_match('/(\p{Cyrillic})|(\p{Latin})|(\p{Hiragana}|\p{Katakana})/ui', $b, $b_index);

		if (count($a_index) != count($b_index)) {
			return count($a_index) - count($b_index);
		}

		return strnatcasecmp($a, $b);
	}
}
