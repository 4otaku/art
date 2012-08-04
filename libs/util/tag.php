<?php

// Хороший кандидат в mixin, если будем переходить на PHP 5.4
class Util_Tag
{
	public static function sort ($a, $b) {
		if (isset($a['name']) && isset($b['name'])) {
			return self::locale_natcmp($a['name'], $b['name']);
		}

		return 0;
	}

	protected static function locale_natcmp ($a, $b) {
		preg_match('/(\p{Cyrillic})|(\p{Latin})|(\p{Hiragana}|\p{Katakana})/ui', $a, $a_index);
		preg_match('/(\p{Cyrillic})|(\p{Latin})|(\p{Hiragana}|\p{Katakana})/ui', $b, $b_index);

		if (count($a_index) != count($b_index)) {
			return count($a_index) - count($b_index);
		}

		return strnatcasecmp($a, $b);
	}

	public static function wcase($count) {
		if ($count > 9) {
			if ($count % 10 == 0 || $count % 10 > 4 || $count[strlen($count)-2] == 1) return 'тегов';
			if ($count % 10 == 1) return 'тег';
			return 'тега';
		}
		if ($count == 0 || $count > 4) return 'тегов';
		if ($count == 1) return 'тег';
		return 'тега';
	}
}
