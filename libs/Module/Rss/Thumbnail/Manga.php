<?php

namespace Otaku\Art;

class Module_Rss_Thumbnail_Manga extends Module_Rss_Thumbnail_Abstract
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
