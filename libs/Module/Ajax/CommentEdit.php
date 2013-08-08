<?php

namespace Otaku\Art;

class ModuleAjaxCommentEdit extends ModuleAbstract
{
	use TraitOutputTpl;

	protected $css = ['comment'];
	protected $js = ['external/wysibb', 'wysibb'];

	protected $id = 0;

	protected function get_params(Query $query) {
		$this->id = $query->get('id');
		$this->set_param('id', $this->id);
	}

	protected function make_request() {
		return new RequestItem('comment', $this,
			['filter' => ['id' => $this->id]]);
	}

	public function recieve_data($data) {
		$this->set_param('text', $data['data']['text']);
	}
}
