<?php

namespace Otaku\Art;

abstract class ModuleAjaxEditAbstract extends ModuleAbstract
{
	use TraitOutputTpl;

	protected $id;
	protected $mode;

	protected function get_params(Query $query) {
		$this->id = $query->get('id');
		$this->mode = $query->get('mode');
	}

	protected function make_request() {
		return new RequestItem($this->mode, $this, ['id' => $this->id]);
	}

	public function recieve_data($data) {
		parent::recieve_data($data['data']);
	}
}