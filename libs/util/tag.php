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
		return Util_Number::wcase($count, 'тег', 'тега', 'тегов');
	}
}
