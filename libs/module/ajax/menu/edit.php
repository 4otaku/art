<?php

class Module_Ajax_Menu_Edit extends Module_Abstract
{
	use Trait_Output_Tpl;

	protected function get_params(Query $query)
	{
		$id = $query->get('id');

		if (empty($id)) {
			return;
		}

		$session = Session::get_instance();
		$cookie = $session->get_hash();

		$item = Database::get_full_row('head_menu_user',
			'cookie = ? and id = ?', [$cookie, $id]);

		foreach ($item as $key => $value) {
			$this->set_param($key, $value);
		}

		$order = Database::order('order', 'asc')->
			get_vector('head_menu_user', ['id', 'order'],
			'cookie = ?', $cookie);

		$set_order = [];
		$i = 0;
		foreach ($order as $order_id => $value) {
			$set_order[] = [
				'selected' => $order_id == $id,
				'order' => ++$i,
			];
		}

		$this->set_param('order', $set_order);
	}
}
