<?php

class Module_Ajax_Comment_Edit extends Module_Abstract
{
	use Trait_Output_Tpl;

	protected $css = ['comment'];
	protected $js = ['external/wysibb', 'wysibb'];

	protected $id = 0;

	protected function get_params(Query $query) {
		$this->id = $query->get('id');
		$this->set_param('id', $this->id);
	}

	protected function make_request() {
		return new Request_Item('comment', $this,
			['filter' => ['id' => $this->id]]);
	}

	public function recieve_data($data) {
		$this->set_param('text', $data['data']['text']);
	}
}
