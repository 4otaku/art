<?php

namespace otaku\art;

class Module_Html_Thumbnail_Comment extends Module_Html_Thumbnail_Abstract
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
