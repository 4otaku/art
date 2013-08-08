<?php

namespace Otaku\Art\Module;

class HtmlThumbnailPack extends HtmlThumbnailAbstract
{
	protected function make_tooltip($data) {
		return $data['title'];
	}
}
