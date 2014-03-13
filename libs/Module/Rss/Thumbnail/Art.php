<?php

namespace Otaku\Art\Module;

class RssThumbnailArt extends RssThumbnailAbstract
{
	public function recieve_data($data) {
		parent::recieve_data($data);
		$this->set_param('date', date('D, d M Y H:i:s O', strtotime($data['sortdate'])));
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
