<?php

class Module_Html_Sidebar_Tag extends Module_Html_Abstract
{
	protected $css = array('sidebar');
	protected $js = array('sidebar');

	public function recieve_data($data) {
		usort($data, 'Util_Tag::sort');

		$this->set_param('data', $data);
	}
}
