<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\AjaxJson;
use Otaku\Framework\Query;
use Otaku\Framework\Database;
use Otaku\Framework\Session;

class AjaxMenuSave extends AjaxJson
{
	protected function get_params(Query $query)
	{
		$id = $query->get('id');
		$url = $query->get('url');
		$name = $query->get('name');
		$order = $query->get('order');

		if (empty($url) || empty($name) || empty($id) || empty($order)) {
			$this->set_error(420);
			return;
		}

		Database::update('head_menu_user',
			['url' => $url, 'name' => $name], $id);

		$session = Session::getInstance();
		$cookie = $session->get_hash();

		$items = Database::order('order', 'asc')->
			get_table('head_menu_user', array('id', 'order'),
			'cookie = ?', $cookie);

		foreach ($items as &$item) {
			if ($item['id'] == $id) {
				$item['new_order'] = $order;
			}
		}
		unset($item);

		$new_order = 1;
		foreach ($items as &$item) {
			if (!empty($item['new_order'])) {
				continue;
			}

			if ($new_order == $order) {
				$new_order++;
			}

			$item['new_order'] = $new_order;
			$new_order++;
		}
		unset($item);

		foreach ($items as $item) {
			if ($item['new_order'] != $item['order']) {
				Database::update('head_menu_user', [
					'order' => $item['new_order']
				], $item['id']);
			}
		}

		$this->set_success(true);
		$this->set_params([
			'name' => $name,
			'url' => $url,
			'order' => $items
		]);
	}
}
