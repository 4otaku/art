<?php

namespace Otaku\Art;

class ModuleRssThumbnailGroup extends ModuleRssThumbnailAbstract
{
	protected function get_title($data) {
		return 'Группа ' . $data['title'];
	}

	protected function get_description($data) {
		return 'Добавлена новая группа';
	}

	protected function get_link($data) {
		return '?group=' . $data['id'];
	}

	protected function get_guid($data) {
		return $data['id'];
	}
}
