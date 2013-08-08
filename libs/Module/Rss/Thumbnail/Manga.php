<?php

namespace Otaku\Art\Module;

class RssThumbnailManga extends RssThumbnailAbstract
{
	protected function get_title($data) {
		return 'Манга ' . $data['title'];
	}

	protected function get_description($data) {
		return 'Добавлена новая манга';
	}

	protected function get_link($data) {
		return '?manga=' . $data['id'];
	}

	protected function get_guid($data) {
		return $data['id'];
	}
}
