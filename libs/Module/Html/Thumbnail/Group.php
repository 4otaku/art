<?php

namespace Otaku\Art;

class Module_Html_Thumbnail_Group extends Module_Html_Thumbnail_Abstract
{
	protected function make_tooltip($data) {
		return $data['title'];
	}
}
