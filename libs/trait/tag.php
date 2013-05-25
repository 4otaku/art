<?php

trait Trait_Tag
{
	use Trait_Number;

	protected function sort_tag ($a, $b)
	{
		if (isset($a['name']) && isset($b['name'])) {
			return self::locale_natcmp($a['name'], $b['name']);
		}

		return 0;
	}

	protected static function locale_natcmp ($a, $b)
	{
		preg_match('/(\p{Cyrillic})|(\p{Latin})|(\p{Hiragana}|\p{Katakana})/ui', $a, $a_index);
		preg_match('/(\p{Cyrillic})|(\p{Latin})|(\p{Hiragana}|\p{Katakana})/ui', $b, $b_index);

		if (count($a_index) != count($b_index)) {
			return count($a_index) - count($b_index);
		}

		return strnatcasecmp($a, $b);
	}

	protected function wcase_tag($count)
	{
		return $this->wcase($count, 'тег', 'тега', 'тегов');
	}

	protected function is_filtered($tags, $strict = false)
	{
		$filtered = array();
		foreach (Config::get('filter') as $name => $type) {
			if ($type == 'hide' || ($strict && $type == 'remove')) {
				$filtered[] = strtolower($name);
			}
		}

		if ($tags) {
			foreach ($tags as $tag) {
				if (in_array(strtolower($tag['name']), $filtered)) {
					return true;
				}
			}
		}

		return false;
	}
}
