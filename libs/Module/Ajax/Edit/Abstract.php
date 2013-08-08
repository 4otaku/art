<?php

namespace Otaku\Art;

use Otaku\Framework\ModuleAbstract;
use Otaku\Framework\TraitOutputTpl;
use Otaku\Framework\RequestItem;
use Otaku\Framework\Query;

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