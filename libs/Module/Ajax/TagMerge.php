<?php

namespace Otaku\Art;

class Module_Ajax_Tag_Merge extends Module_Abstract
{
	use Trait_Output_Tpl;

	protected $id = 0;

	protected function get_params(Query $query) {
		$this->id = $query->get('id');
		$this->set_param('id', $this->id);
	}

	protected function make_request() {
		return new Request_Item('tag_art', $this,
			['id' => $this->id]);
	}
}
