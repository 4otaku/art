<?php

class Module_Html_Sidebar_Tag extends Module_Html_Abstract
{
	use Trait_Tag;

	protected $css = array('sidebar');

	public function recieve_data($data) {
		usort($data, array($this, 'sort_tag'));

		$this->set_param('data', $data);
	}
}
