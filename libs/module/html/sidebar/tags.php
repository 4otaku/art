<?php

class Module_Html_Sidebar_Tags extends Module_Html_Abstract
{
	protected $css = array('sidebar');
	protected $js = array('sidebar');

	public function recieve_data($data) {
		$this->set_param('data', $data);
	}
}
