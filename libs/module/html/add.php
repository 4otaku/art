<?php

class Module_Html_Add extends Module_Html_Abstract
{
	use Trait_Module_Art;

	protected $js = ['external/upload', 'ajaxtip', 'add'];
	protected $css = ['external/upload', 'ajaxtip', 'add'];

	protected function get_params(Query $query)
	{
		$this->set_param('query', $query->to_url_string());

		$parsed = $query->parsed();

		if (!empty($parsed['tag']['is'])) {
			$this->set_param('tags', implode(' ', $parsed['tag']['is']));
		} else {
			$this->set_param('tags', '');
		}
	}

	protected function make_request()
	{
		$parsed = $this->get_query()->parsed();

		$request = [];

		if (!empty($parsed['group']['is'])) {
			$request[] = new Request('art_group', $this,
				['id' => $parsed['group']['is']], 'recieve_groups');
			$this->set_param('have_groups', 1);
		} else {
			$this->set_param('groups', []);
			$this->set_param('have_groups', 0);
		}

		if (!empty($parsed['pack']['is'])) {
			$request[] = new Request('art_pack', $this,
				['id' => $parsed['pack']['is']], 'recieve_packs');
			$this->set_param('have_packs', 1);
		} else {
			$this->set_param('packs', []);
			$this->set_param('have_packs', 0);
		}

		if (!empty($parsed['manga']['is'])) {
			$request[] = new Request('art_pack', $this,
				['id' => $parsed['manga']['is']], 'recieve_manga');
			$this->set_param('have_manga', 1);
		} else {
			$this->set_param('manga', []);
			$this->set_param('have_manga', 0);
		}

		return new Request_Multi($request);
	}

	public function recieve_groups($data)
	{
		var_dump($data);
	}

	public function recieve_packs($data)
	{
		var_dump($data);
	}

	public function recieve_manga($data)
	{
		var_dump($data);
	}
}
