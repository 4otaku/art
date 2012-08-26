<?php

class Module_Html_Thumbnail_Translation extends Module_Html_Thumbnail_Abstract
{
	use Trait_Number;

	protected function make_tooltip($data) {
		$count = $data['translation_count'];
		$count = $this->wcase($count, 'Переведена', 'Переведено', 'Переведено') .
			' ' . $count . ' ' . $this->wcase($count, 'фраза', 'фразы', 'фраз') . '.';
		$users = 'Переводчик' . (count($data['translator']) > 1 ? 'и' : '') .
			': ' . implode(', ', $data['translator']) . '.';
		return $count . ' ' . $users;
	}
}
