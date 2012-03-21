<?php

class Module_Main extends Module_Abstract
{
	protected function get_modules(Query $query)
	{
		if ($query->url(0) == 'download') {
			return array(new Module_Download($query));
		}

		return array('html' => new Module_Html($query));
	}
}
