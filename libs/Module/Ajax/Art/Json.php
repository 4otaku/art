<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\AjaxApi;
use Otaku\Art\TraitModuleArtList;

class AjaxArtJson extends AjaxApi
{
	use TraitModuleArtList;

	protected function make_request() {
		return $this->get_common_request();
	}
}
