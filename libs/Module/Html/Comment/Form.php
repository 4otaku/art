<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\HtmlAbstract;
use Otaku\Framework\Query;
use Otaku\Framework\Config;

class HtmlCommentForm extends HtmlAbstract
{
	protected $css = ['comment'];
	protected $js = ['external/wysibb', 'wysibb', 'comment'];

	protected function get_params(Query $query)
	{
		$data = Config::getInstance()->get();

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
