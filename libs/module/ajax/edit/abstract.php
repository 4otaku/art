<?php

abstract class Module_Ajax_Edit_Abstract extends Module_Abstract
{
	use Trait_Output_Tpl;

	protected $id;
	protected $mode;

	protected function get_params(Query $query) {
		$this->id = $query->get('id');
		$this->mode = $query->get('mode');
	}

	public function recieve_data($data) {
		parent::recieve_data($data['data']);
	}
}