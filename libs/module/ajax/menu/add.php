<?php

namespace otaku\art;

class Module_Ajax_Menu_Add extends Module_Ajax_Json
{
	protected function get_params(Query $query)
	{
		$url = $query->get('url');
		$name = $query->get('name');

		if (empty($url) || empty($name)) {
			$this->set_error(420);
			return;
		}

		$session = Session::get_instance();
		$cookie = $session->get_hash();

		$order = Database::get_field('head_menu_user',
			'max(`order`)', 'cookie = ?', $cookie);

		Database::insert('head_menu_user', [
			'cookie' => $cookie,
			'name' => $name,
			'url' => $url,
			'order' => (int) $order + 1
		]);

		$this->set_success(true);
		$this->set_params([
			'id' => Database::last_id(),
			'name' => $name,
			'url' => $url
		]);
	}
}
