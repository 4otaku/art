<?php

namespace Otaku\Art\Module;

class RssThumbnailPack extends RssThumbnailAbstract
{
	protected function get_title($data) {
		return 'CG-пак игры ' . $data['title'];
	}

	protected function get_description($data) {
		return 'Добавлена новый пак';
	}

	protected function get_link($data) {
		return '?pack=' . $data['id'];
	}

	protected function get_guid($data) {
		return $data['id'];
	}
}
