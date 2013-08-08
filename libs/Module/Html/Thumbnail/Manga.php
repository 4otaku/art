<?php

namespace Otaku\Art\Module;

class HtmlThumbnailManga extends HtmlThumbnailAbstract
{
	protected function make_tooltip($data) {
		return $data['title'];
	}
}
