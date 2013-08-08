<?php

namespace Otaku\Art;

class ModuleHtmlAdd extends ModuleHtmlAbstract
{
	protected function get_modules(Query $query)
	{
		if ($query->url(1) == 'group') {
			return new ModuleHtmlAddGroup($query);
		}

		if ($query->url(1) == 'pack') {
			return new ModuleHtmlAddPack($query);
		}

		if ($query->url(1) == 'manga') {
			return new ModuleHtmlAddManga($query);
		}

		return new ModuleHtmlAddArt($query);
	}
}
