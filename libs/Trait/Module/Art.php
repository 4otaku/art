<?php

namespace Otaku\Art;

use Otaku\Framework\Query;

trait TraitModuleArt
{
	private $query;

	protected function preprocess_query(Query $query)
	{
		if (!($query instanceOf QueryArt)) {
			$query = new QueryArt($query);
		}

		$this->query = $query;

		return $query;
	}

	protected function get_query() {
		return $this->query;
	}
}
