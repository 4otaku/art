<?php

class Module_Html_Thumbnail_Comment extends Module_Html_Thumbnail_Abstract
{
	protected function make_tooltip($data) {
		$username = $data['comment']['username'];
		$text = new Text($data['comment']['text']);
		return $username . ': ' . $text->trim()->format()->strip('<br>')
			->cut_long_text(100);
	}
}
