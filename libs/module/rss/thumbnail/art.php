<?php

class Module_Rss_Thumbnail_Art extends Module_Rss_Thumbnail_Abstract
{
	protected function get_title($data) {
		return 'Арт №' . $data['id'];
	}

	protected function get_description($data) {
		return 'Опубликовал ' . $data['user'];
	}

	protected function get_link($data) {
		return $data['id'];
	}

	protected function get_guid($data) {
		return $data['id'];
	}
}
