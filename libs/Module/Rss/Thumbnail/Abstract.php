<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\Base;
use Otaku\Framework\TraitOutputTpl;

abstract class RssThumbnailAbstract extends Base
{
	use TraitOutputTpl;

	public function recieve_data($data) {
		$this->set_param('title', $this->get_title($data));
		$this->set_param('description', $this->get_description($data));
		$this->set_param('link', 'https://' . $_SERVER['SERVER_NAME'] .
			'/' . $this->get_link($data));
		$this->set_param('guid', $this->get_guid($data));
	}

	abstract protected function get_title($data);
	abstract protected function get_description($data);
	abstract protected function get_link($data);
	abstract protected function get_guid($data);
}
