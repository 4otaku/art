<?php

class Module_Html_Comment_Form extends Module_Html_Abstract
{
	protected $css = ['comment'];
	protected $js = ['external/wysibb', 'wysibb', 'comment'];

	protected function get_params(Query $query)
	{
		$data = Config::get();

		if (isset($data['default']['name'])) {
			$this->set_param('name', $data['default']['name']);
		} elseif (isset($data['user']['login'])) {
			$this->set_param('name', $data['user']['login']);
		}

		if (isset($data['default']['mail'])) {
			$this->set_param('mail', $data['default']['mail']);
		} elseif (isset($data['user']['email'])) {
			$this->set_param('mail', $data['user']['email']);
		}

		$this->set_param('id_item', (int) $query->url(0));
	}
}
