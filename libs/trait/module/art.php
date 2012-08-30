<?php

trait Trait_Module_Art
{
	private $query;

	protected function preprocess_query(Query $query)
	{
		if (!($query instanceOf Query_Art)) {
			$query = new Query_Art($query);
		}

		$this->query = $query;

		return $query;
	}

	protected function get_query() {
		return $this->query;
	}
}
