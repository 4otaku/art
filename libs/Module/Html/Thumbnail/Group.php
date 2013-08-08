<?php

namespace Otaku\Art;

class ModuleHtmlThumbnailGroup extends ModuleHtmlThumbnailAbstract
{
	protected function make_tooltip($data) {
		return $data['title'];
	}
}
