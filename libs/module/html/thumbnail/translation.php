<?php

class Module_Html_Thumbnail_Translation extends Module_Html_Thumbnail_Abstract
{
	protected function make_tooltip($data) {
		$count = 'Переведено ' . $data['translation_count'] . ' фраз. ';
		$users = 'Переводчик' . (count($data['translator']) > 1 ? 'и' : '') .
			': ' . implode(', ', $data['translator']) . '.';
		return $count . $users;
	}
}
