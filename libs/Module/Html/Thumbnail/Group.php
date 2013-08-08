<?php

namespace Otaku\Art\Module;

class HtmlThumbnailGroup extends HtmlThumbnailAbstract
{
	protected function make_tooltip($data) {
		return $data['title'];
	}
}
