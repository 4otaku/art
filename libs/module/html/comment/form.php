<?php

class Module_Html_Comment_Form extends Module_Html_Abstract
{
	protected $css = ['comment'];
	protected $js = ['external/wysibb', 'wysibb', 'comment'];

	protected function get_params(Query $query)
	{
		$data = Session::get_instance()->get_data();

		$this->set_param('name', $data['user']['login']);
		$this->set_param('mail', $data['user']['email']);
	}
}
