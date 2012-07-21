<?php

class Module_Html_Thumbnail_Manga extends Module_Html_Thumbnail_Abstract
{
	protected function make_tooltip($data) {
		return $data['title'];
	}
}
