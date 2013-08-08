<?php

namespace Otaku\Art;

class ModuleHtmlThumbnailArt extends ModuleHtmlThumbnailAbstract
{
	use TraitTag;

	protected function make_tooltip($data) {
		$parts = array();
		$parts[] = 'Рейтинг: ' . $data['rating'];
		$parts[] = 'Опубликовал: ' . $data['user'];
		if (!empty($data['tag'])) {

			$tags = array();
			foreach ($data['tag'] as $tag) {
				$tags[$tag['name']] = $tag['count'];
			}
			arsort($tags);

			$is_ie = (strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== false);
			$tag_limit = $is_ie ? 20 : 40;

			$show_tags = array_slice($tags, 0, $tag_limit, true);
			$show_tags = array_keys($show_tags);
			usort($show_tags, array($this, 'sort_tag'));

			$start = count($show_tags) > 1 ? 'Теги' : 'Тег';
			$end = '';
			if (count($tags) > $tag_limit) {
				$count = count($tags) - $tag_limit;
				$end = ' и еще ' . $count . ' ' . $this->wcase_tag($count);
			}
			$parts[] = $start . ': ' . implode(', ', $show_tags) . $end;
		}
		return implode(' | ', $parts);
	}
}
