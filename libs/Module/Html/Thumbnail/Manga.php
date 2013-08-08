<?php

namespace Otaku\Art;

class ModuleHtmlThumbnailManga extends ModuleHtmlThumbnailAbstract
{
	protected function make_tooltip($data) {
		return $data['title'];
	}
}
