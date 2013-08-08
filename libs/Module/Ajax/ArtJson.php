<?php

namespace Otaku\Art;

class ModuleAjaxArtJson extends ModuleAjaxApi
{
	use TraitModuleArtList;

	protected function make_request() {
		return $this->get_common_request();
	}
}
