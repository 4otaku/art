<?php

namespace Otaku\Art;

trait TraitModuleArtList
{
	use TraitModuleArt;

	protected function get_common_request() {
		$query = $this->get_query();
		$params = $query->other();
		$params['parsed'] = $query->parsed();
		$params['pool_mode'] = $query->get_pool_mode();
		$params['pool_value'] = $query->get_pool_value();
		return new RequestArtList($this, $params);
	}
}
