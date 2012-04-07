<?php

class Module_Ajax_Menu_Delete extends Module_Ajax_Json
{
	protected function get_params(Query $query)
	{
		$id = $query->get('id');

		if (empty($id)) {
			$this->error_code = 420;
			return;
		}

		Database::delete('head_menu_user', $id);

		$this->success = true;
	}
}
