<?php

namespace Otaku\Art\Module;

class RssThumbnailArtist extends RssThumbnailAbstract
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
