<?php

namespace Otaku\Art;

class ModuleAjaxMenuDelete extends ModuleAjaxJson
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
