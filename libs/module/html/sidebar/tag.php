<?php

class Module_Html_Sidebar_Tag extends Module_Html_Abstract
{
	use Trait_Tag;

	protected $css = array('sidebar');

	protected function get_params(Query $query)
	{
		$this->set_param('prefix', '');
		$this->set_param('mode', false);
	}

	public function set_pool_mode($mode)
	{
		$this->set_param('prefix', 'mode=' . $mode .'&');
		$this->set_param('mode', $mode);
	}

	public function recieve_data($data) {
		usort($data, array($this, 'sort_tag'));
		$this->set_param('data', $data);
	}
}
