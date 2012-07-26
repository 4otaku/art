<?php

abstract class Module_Html_Thumbnail_Abstract extends Module_Html_Abstract
{
	protected $css = array('thumb');

	public function recieve_data($data) {
		$data['tip'] = $this->make_tooltip($data);

		parent::recieve_data($data);
	}

	abstract protected function make_tooltip($data);
}
