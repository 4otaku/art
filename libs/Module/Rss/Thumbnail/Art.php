<?php

namespace Otaku\Art\Module;

class RssThumbnailArt extends RssThumbnailAbstract
{
	public function recieve_data($data) {
		parent::recieve_data($data);
		$this->set_param('md5', $data['md5']);
	}

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
