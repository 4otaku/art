<?php

namespace Otaku\Art;

class ModuleRssThumbnailArtist extends ModuleRssThumbnailAbstract
{
	protected function get_title($data) {
		return 'Галерея художника ' . $data['artist'];
	}

	protected function get_description($data) {
		return 'Добавлена новая галерея';
	}

	protected function get_link($data) {
		return '?artist=' . $data['id'];
	}

	protected function get_guid($data) {
		return $data['id'];
	}
}
