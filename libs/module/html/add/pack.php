<?php

namespace otaku\art;

class Module_Html_Add_Pack extends Module_Html_Add_Pool
{
	protected function get_modules(Query $query)
	{
		return ['form' => new Module_Html_Add_Form($query)];
	}
}
