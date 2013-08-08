<?php

namespace Otaku\Art;

use Otaku\Framework\ModuleAjaxApi;

class ModuleAjaxArtJson extends ModuleAjaxApi
{
	use TraitModuleArtList;

	protected function make_request() {
		return $this->get_common_request();
	}
}
