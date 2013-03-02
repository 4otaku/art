<?php

abstract class Module_Ajax_Create_Pool extends Module_Ajax_Create_Abstract
{
	protected function get_params(Query $query)
	{
		$this->data = [
			'tag' => array_filter((array) $query->get('tag')),
			'title' => (string) $query->get('title'),
			'text' => (string) $query->get('text'),
		];
	}
}