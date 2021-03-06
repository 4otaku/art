<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Text;

class RssThumbnailComment extends RssThumbnailAbstract
{
	protected function get_title($data) {
		return 'Новый комментарий к арту №' . $data['id'];
	}

	protected function get_description($data) {
		$text = new Text($data['comment']['text']);
		$text->format_rss();

		return '<![CDATA[' . $text . ']]>';
	}

	protected function get_link($data) {
		return $data['id'] . '#comment-' . $data['comment']['id'];
	}

	protected function get_guid($data) {
		return $data['comment']['id'];
	}
}
