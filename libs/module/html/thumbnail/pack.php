<?php

namespace otaku\art;

class Module_Html_Thumbnail_Pack extends Module_Html_Thumbnail_Abstract
{
	protected function make_tooltip($data) {
		return $data['title'];
	}
}
