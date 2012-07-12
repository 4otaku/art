<?php

class Module_Html_Body extends Module_Html_Abstract
{
	protected $css = array('base');

	protected function get_modules(Query $query)
	{
		if (is_numeric($query->url(0))) {
			return new Module_Html_Art_Item($query);
		}

		if ($query->url(0) == 'add') {
			return new Module_Html_Add($query);
		}

		if ($query->url(0) == 'settings') {
			return new Module_Html_Settings($query);
		}

		if ($query->url(0) == 'art') {
			return new Module_Html_Art($query);
		}

		return new Module_Html_Art_List($query);
	}
}
