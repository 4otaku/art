<?php

namespace Otaku\Art;

class ModuleHtmlAddTemplate extends ModuleHtmlAbstract
{
	use TraitModuleArt;

	protected function get_params(Query $query)
	{
		$this->set_param('query', $query->to_url_string());

		$parsed = $query->parsed();

		if (!empty($parsed['tag']['is'])) {
			$this->set_param('tags', implode(' ', $parsed['tag']['is']) . ' ');
		} else {
			$this->set_param('tags', '');
		}

		$this->set_param('groups', []);
		$this->set_param('have_groups', 0);
		$this->set_param('packs', []);
		$this->set_param('have_packs', 0);
		$this->set_param('manga', []);
		$this->set_param('have_manga', 0);
	}

	protected function make_request()
	{
		$parsed = $this->get_query()->parsed();

		$request = [];

		if (!empty($parsed['group']['is'])) {
			$request[] = new RequestRead('art_group', $this,
				['id' => $parsed['group']['is']], 'recieve_groups');
		}

		if (!empty($parsed['pack']['is'])) {
			$request[] = new RequestRead('art_pack', $this,
				['id' => $parsed['pack']['is']], 'recieve_packs');
		}

		if (!empty($parsed['manga']['is'])) {
			$request[] = new RequestRead('art_manga', $this,
				['id' => $parsed['manga']['is']], 'recieve_manga');
		}

		return $request;
	}

	public function recieve_groups($data)
	{
		$this->set_param('have_groups', !empty($data['data']));
		$this->set_param('groups', array_map(function(&$item){
			unset($item['text']);
			return $item;
		}, $data['data']));
	}

	public function recieve_packs($data)
	{
		$this->set_param('have_packs', !empty($data['data']));
		$this->set_param('packs', array_map(function(&$item){
			unset($item['text']);
			return $item;
		}, $data['data']));
	}

	public function recieve_manga($data)
	{
		$this->set_param('have_manga', !empty($data['data']));
		$this->set_param('manga', array_map(function(&$item){
			unset($item['text']);
			return $item;
		}, $data['data']));
	}
}