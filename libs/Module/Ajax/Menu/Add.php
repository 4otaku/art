<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\AjaxJson;
use Otaku\Framework\TraitOutputTpl;
use Otaku\Framework\Query;
use Otaku\Framework\Session;
use Otaku\Framework\Database;

class AjaxMenuAdd extends AjaxJson
{
	protected function get_params(Query $query)
	{
		$url = $query->get('url');
		$name = $query->get('name');

		if (empty($url) || empty($name)) {
			$this->set_error(420);
			return;
		}

		$session = Session::getInstance();
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
