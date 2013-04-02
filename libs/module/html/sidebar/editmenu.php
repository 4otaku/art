<?php

class Module_Html_Sidebar_Editmenu extends Module_Html_Abstract
{
	use Trait_Module_Art_List;

	protected $js = ['edit'];
	protected $css = ['sidebar'];

	protected function get_params(Query $query) {
		$this->set_param('mode', $query->get_pool_mode());
		$this->set_param('moderator', Session::is_moderator());
		$this->set_param('id', $query->get_pool_mode() ?
			$query->get_pool_value() : $query->url(0));
	}

	public function recieve_additional($data) {
		$this->set_param('voted', $data['voted'] != 0);
		$this->set_param('have_translation', !empty($data['translation']));
		$this->set_param('have_source', !empty($data['source']));
	}
}