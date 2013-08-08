<?php

namespace Otaku\Art;

trait Trait_Module_Art_List
{
	use Trait_Module_Art;

	protected function get_common_request() {
		$query = $this->get_query();
		$params = $query->other();
		$params['parsed'] = $query->parsed();
		$params['pool_mode'] = $query->get_pool_mode();
		$params['pool_value'] = $query->get_pool_value();
		return new Request_Art_List($this, $params);
	}
}
