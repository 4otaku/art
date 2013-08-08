<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\HtmlAbstract;
use Otaku\Framework\Query;

class HtmlAdd extends HtmlAbstract
{
	protected function get_modules(Query $query)
	{
		if ($query->url(1) == 'group') {
			return new HtmlAddGroup($query);
		}

		if ($query->url(1) == 'pack') {
			return new HtmlAddPack($query);
		}

		if ($query->url(1) == 'manga') {
			return new HtmlAddManga($query);
		}

		return new HtmlAddArt($query);
	}
}
