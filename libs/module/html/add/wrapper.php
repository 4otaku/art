<?php

class Module_Html_Add extends Module_Html_Abstract
{
	protected function get_modules(Query $query)
	{
		return [
			'form' => new Module_Html_Add_Form($query),
			'help' => new Module_Html_Add_Help($query),
		];
	}
}
