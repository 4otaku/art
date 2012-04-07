<?php

class Module_Ajax_Menu_Edit extends Module_Html_Abstract
{
	protected function get_params(Query $query)
	{
		$id = $query->get('id');

		if (empty($id)) {
			return;
		}

		$session = Session::get_instance();
		$cookie = $session->get_hash();

		$item = Database::get_full_row('head_menu_user',
			'cookie = ? and id = ?', array($cookie, $id));

		foreach ($item as $key => $value) {
			$this->set_param($key, $value);
		}

		$order = Database::order('order', 'asc')->
			get_vector('head_menu_user', array('id', 'order'),
			'cookie = ?', $cookie);

		$set_order = array();
		$i = 0;
		foreach ($order as $order_id => $value) {
			$set_order[] = array(
				'selected' => $order_id == $id,
				'order' => ++$i,
			);
		}

		$this->set_param('order', $set_order);
	}
}
