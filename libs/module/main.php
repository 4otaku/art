<?php

class Module_Main extends Module_Abstract
{
	protected function get_modules(Query $query) {
		if ($query->url(0) == 'download') {
			return new Module_Download($query);
		}

		return new Module_Html($query);
	}
}
