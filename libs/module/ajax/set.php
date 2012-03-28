<?php

class Module_Ajax_Set extends Module_Html_Abstract
{
	protected function get_params(Query $query)
	{
		$section = $query->get('section');
		$key = $query->get('key');
		$value = $query->get('value');

		if (preg_match('/[^a-z_\d]/ui', $section) ||
			preg_match('/[^a-z_\d]/ui', $key)) {

			exit();
		}

		$session = Session::get_instance();
		$session->set($section, $key, $value);

		exit();
	}
}
