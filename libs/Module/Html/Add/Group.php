<?php

namespace Otaku\Art;

class Module_Html_Add_Group extends Module_Html_Add_Pool
{
	protected function get_modules(Query $query)
	{
		return ['form' => new Module_Html_Add_Form($query)];
	}
}
