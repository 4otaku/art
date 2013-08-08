<?php

namespace Otaku\Art;

use Otaku\Framework\ModuleAbstract;
use Otaku\Framework\TraitOutputTpl;
use Otaku\Framework\Query;
use Otaku\Framework\RequestItem;

class ModuleAjaxTagMerge extends ModuleAbstract
{
	use TraitOutputTpl;

	protected $id = 0;

	protected function get_params(Query $query) {
		$this->id = $query->get('id');
		$this->set_param('id', $this->id);
	}

	protected function make_request() {
		return new RequestItem('tag_art', $this,
			['id' => $this->id]);
	}
}
