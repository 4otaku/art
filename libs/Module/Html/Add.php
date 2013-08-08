<?php

namespace Otaku\Art;

class Module_Html_Add extends Module_Html_Abstract
{
	protected function get_modules(Query $query)
	{
		if ($query->url(1) == 'group') {
			return new Module_Html_Add_Group($query);
		}

		if ($query->url(1) == 'pack') {
			return new Module_Html_Add_Pack($query);
		}

		if ($query->url(1) == 'manga') {
			return new Module_Html_Add_Manga($query);
		}

		return new Module_Html_Add_Art($query);
	}
}
