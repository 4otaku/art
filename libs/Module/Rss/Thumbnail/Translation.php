<?php

namespace Otaku\Art;

class ModuleRssThumbnailTranslation extends ModuleRssThumbnailAbstract
{
	protected function get_title($data) {
		return 'Новый перевод арта №' . $data['id'];
	}

	protected function get_description($data) {
		return 'Всего переводов: ' . $data['translation_count'];
	}

	protected function get_link($data) {
		return $data['id'];
	}

	protected function get_guid($data) {
		return $data['id'] . '_' . $data['translation_count']
			. '_' . count($data['translator']);
	}
}
