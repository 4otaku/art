<?php

namespace Otaku\Art;

class Module_Main extends Module_Abstract
{
	use Trait_Output_Plain;

	protected function get_modules(Query $query) {
		if ($query->url(0) == 'download') {
			return new Module_Download($query);
		}

		if ($query->url(0) == 'ajax') {
			return new Module_Ajax($query);
		}

		if ($query->url(0) == 'rss') {
			return new Module_Rss($query);
		}

		return new Module_Html($query);
	}
}