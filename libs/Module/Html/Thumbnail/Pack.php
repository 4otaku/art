<?php

namespace Otaku\Art;

class ModuleHtmlThumbnailPack extends ModuleHtmlThumbnailAbstract
{
	protected function make_tooltip($data) {
		return $data['title'];
	}
}
