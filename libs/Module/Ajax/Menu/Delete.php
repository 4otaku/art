<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\AjaxJson;
use Otaku\Framework\Query;
use Otaku\Framework\Database;

class AjaxMenuDelete extends AjaxJson
{
	protected function get_params(Query $query)
	{
		$id = $query->get('id');

		if (empty($id)) {
			$this->set_error(420);
			return;
		}

		Database::delete('head_menu_user', $id);

		$this->set_success(true);
	}
}
