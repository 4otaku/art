<?php

class Module_Html_Thumbnail_Comment extends Module_Html_Thumbnail_Abstract
{
	protected $css = array('comment');

	protected function make_tooltip($data) {
		$username = $data['comment']['username'];
		$text = new Text($data['comment']['text']);
		return '[b]' . $username . ":[/b]\n " . $text->trim()->links2bb();
	}
}
