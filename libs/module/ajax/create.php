<?php

class Module_Ajax_Create extends Module_Ajax_Json
{
	protected $data = [];

	protected function get_params(Query $query)
	{
		$this->data = [
			'upload_key' => (string) $query->get('upload_key'),
			'tag' => array_filter((array) $query->get('tag')),
			'source' => (string) $query->get('source'),
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

	protected function make_request()
	{
		return new Request_Change('create_art', $this, $this->data);
	}

	public function recieve_data($data)
	{
		if (isset($data['id'])) {
			$this->set_param('id', $data['id']);
			$this->set_success(true);
		}
		if (isset($data['errors'])) {
			$error = reset($data['errors']);
			$this->set_error($error['code'], $error['message']);
		}
	}
}