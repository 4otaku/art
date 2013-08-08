<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\AjaxJson;
use Otaku\Framework\Query;
use Otaku\Framework\Session;

class AjaxSetting extends AjaxJson
{
	protected function get_params(Query $query)
	{
		$section = $query->get('section');
		$key = $query->get('key');
		$value = $query->get('value');
		$values = (array) $query->get('values');
		if (empty($values)) {
			$values = [$key => $value];
		}

		foreach ($values as $key => $value) {
			if (preg_match('/[^a-z_\d]/ui', $section)) {
				$this->set_error(430);
				return;
			}

			$session = Session::get_instance();
			$session->set($section, $key, $value);
		}

		$this->set_success(true);
	}
}
