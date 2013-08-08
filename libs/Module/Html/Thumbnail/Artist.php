<?php

namespace Otaku\Art;

class ModuleHtmlThumbnailArtist extends ModuleHtmlThumbnailAbstract
{
	protected function make_tooltip($data) {
		return $data['artist'];
	}
}
