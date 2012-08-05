<?php

class Module_Html_Thumbnail_Translation extends Module_Html_Thumbnail_Abstract
{
	protected function make_tooltip($data) {
		$count = $data['translation_count'];
		$count = Util_Number::wcase($count, 'Переведена', 'Переведено', 'Переведено') .
			' ' . $count . ' ' . Util_Number::wcase($count, 'фраза', 'фразы', 'фраз') . '.';
		$users = 'Переводчик' . (count($data['translator']) > 1 ? 'и' : '') .
			': ' . implode(', ', $data['translator']) . '.';
		return $count . ' ' . $users;
	}
}
