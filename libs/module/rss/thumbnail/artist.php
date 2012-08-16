<?php

class Module_Rss_Thumbnail_Artist extends Module_Rss_Thumbnail_Abstract
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
