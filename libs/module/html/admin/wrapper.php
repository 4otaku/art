<?php

class Module_Html_Admin extends Module_Html_Abstract
{
	protected $css = array('admin');

	protected function get_modules(Query $query)
	{
		if (!Session::is_moderator()) {
			return [];
		}

		$return = [new Module_Html_Admin_Menu($query)];

		if ($query->url(1) == 'tag') {
			$return[] = new Module_Html_Admin_Tag($query);
		}

		if ($query->url(1) == 'help') {
			$return[] = new Module_Html_Admin_Help($query);
		}

		if ($query->url(1) == 'similar') {
			$return[] = new Module_Html_Admin_Similar($query);
		}

		return $return;
	}
}
