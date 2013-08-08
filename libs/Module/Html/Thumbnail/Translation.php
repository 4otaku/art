<?php

namespace Otaku\Art\Module;

use Otaku\Framework\TraitNumber;

class HtmlThumbnailTranslation extends HtmlThumbnailAbstract
{
	use TraitNumber;

	protected function make_tooltip($data) {
		$count = $data['translation_count'];
		$count = $this->wcase($count, 'Переведена', 'Переведено', 'Переведено') .
			' ' . $count . ' ' . $this->wcase($count, 'фраза', 'фразы', 'фраз') . '.';
		$users = 'Переводчик' . (count($data['translator']) > 1 ? 'и' : '') .
			': ' . implode(', ', $data['translator']) . '.';
		return $count . ' ' . $users;
	}
}
