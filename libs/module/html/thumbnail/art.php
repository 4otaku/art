<?php

class Module_Html_Thumbnail_Art extends Module_Html_Thumbnail_Abstract
{
	protected function make_tooltip($data) {
		$parts = array();
		if (!empty($data['tag'])) {
			$tags = array();
			foreach ($data['tag'] as $tag) {
				$tags[] = $tag['name'];
			}
			sort($tags);
			$start = count($tags) > 1 ? 'Теги' : 'Тег';
			$parts[] = $start . ': ' . implode(', ', $tags);
		}
		$parts[] = 'Рейтинг: ' . $data['rating'];
		$parts[] = 'Опубликовал: ' . $data['user'];
		return implode(' | ', $parts);
	}
}
