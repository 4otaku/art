<?php

namespace Otaku\Art;

class ModuleHtmlThumbnailComment extends ModuleHtmlThumbnailAbstract
{
	protected $css = array('thumb', 'comment');

	protected function make_tooltip($data) {
		$return = array();
		$data['comment'] = array_reverse($data['comment']);
		foreach ($data['comment'] as $comment) {
			$username = $comment['username'];
			$text = new Text($comment['text']);
			$return[] = $comment['sortdate'] . ', ' .
				'[b]' . $username . "[/b]:\n " .
				$text->trim()->links2bb();
		}

		return implode("\n\n", $return);
	}
}
