<?php

namespace Otaku\Art\Module;

class HtmlThumbnailArtist extends HtmlThumbnailAbstract
{
	protected function make_tooltip($data) {
		return $data['artist'];
	}
}
