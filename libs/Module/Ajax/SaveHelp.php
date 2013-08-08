<?php

namespace Otaku\Art;

class Module_Ajax_Save_Help extends Module_Ajax_Json
{
	protected function get_params(Query $query) {
		if (Session::is_moderator()) {
			Database::replace('help', array(
				'key' => 'add',
				'text' => (string) $query->get('text')
			), array('key'));
		}

		$this->set_success(true);
	}
}