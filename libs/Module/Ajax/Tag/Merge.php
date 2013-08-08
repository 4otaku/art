<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\Base;
use Otaku\Framework\TraitOutputTpl;
use Otaku\Framework\Query;
use Otaku\Framework\RequestItem;

class AjaxTagMerge extends Base
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
