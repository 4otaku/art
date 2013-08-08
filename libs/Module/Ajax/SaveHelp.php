<?php

namespace Otaku\Art;

class ModuleAjaxSaveHelp extends ModuleAjaxJson
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