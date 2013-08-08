<?php

namespace Otaku\Art;

use Otaku\Framework\ModuleAbstract;
use Otaku\Framework\ModuleContainer;
use Otaku\Framework\RequestRead;
use Otaku\Framework\Query;
use Otaku\Framework\TraitOutputTpl;

class ModuleAjaxArtList extends ModuleAbstract
{
	use TraitOutputTpl, TraitModuleArtList;

	protected $data = array();

	protected function get_modules(Query $query) {
		return new ModuleContainer('html_art_image');
	}

	protected function make_request() {
		return $this->get_common_request();
	}

	public function recieve_data($data) {
		$data = isset($data['data']) ? $data['data'] : array();
		$this->count = isset($data['count']) ? $data['count'] : 0;

		foreach ($data as $item) {
			$this->data[] = $item['id'];
		}

		$request = new RequestRead('art', $this, array(
			'id' => $this->data,
			'add_translations' => 1
		), 'recieve_details');
		$request->perform();
	}

	public function recieve_details($data) {
		$data = isset($data['data']) ? $data['data'] : array();
		foreach ($this->data as $key => $id) {
			foreach ($data as $item) {
				if ($item['id'] == $id) {
					$this->data[$key] = $item;
					continue 2;
				}
			}
			unset($this->data[$key]);
		}
		$this->modules[0]->recieve_data($this->data);
	}
}
