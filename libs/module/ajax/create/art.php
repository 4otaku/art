<?php

class Module_Ajax_Create_Art extends Module_Ajax_Create_Abstract
{
	protected $request_type = 'create_art';

	protected function get_params(Query $query)
	{
		$this->data = [
			'upload_key' => (string) $query->get('upload_key'),
			'tag' => array_filter((array) $query->get('tag')),
			'source' => (string) $query->get('source'),
			'comment' => (string) $query->get('comment'),
			'group' => $this->parse_groups($query->get('group')),
			'pack' => (array) $query->get('pack'),
			'manga' => $this->parse_groups($query->get('manga')),
			'artist' => (int) (bool) $query->get('artist'),
			'approved' => (int) (bool) $query->get('approved'),
		];
	}

	protected function parse_groups($items)
	{
		$items = (array) $items;
		foreach ($items as &$item) {
			$item = ['id' => $item];
		}
		return $items;
	}
}