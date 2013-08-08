<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\AjaxJson;
use Otaku\Framework\Query;
use Otaku\Framework\Session;
use Otaku\Framework\Database;

class AjaxSaveHelp extends AjaxJson
{
	protected function get_params(Query $query) {
		if (Session::getInstance()->is_moderator()) {
			Database::replace('help', array(
				'key' => 'add',
				'text' => (string) $query->get('text')
			), array('key'));
		}

		$this->set_success(true);
	}
}