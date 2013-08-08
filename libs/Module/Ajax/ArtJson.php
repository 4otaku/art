<?php

namespace Otaku\Art;

class Module_Ajax_Art_Json extends Module_Ajax_Api
{
	use Trait_Module_Art_List;

	protected function make_request() {
		return $this->get_common_request();
	}
}
