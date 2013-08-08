<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\Base;
use Otaku\Framework\Module\Ajax;
use Otaku\Framework\Module\Download;
use Otaku\Framework\Query;
use Otaku\Framework\TraitOutputPlain;

class Main extends Base
{
	use TraitOutputPlain;

	protected function get_modules(Query $query) {
		if ($query->url(0) == 'download') {
			return new Download($query);
		}

		if ($query->url(0) == 'ajax') {
			return new Ajax($query);
		}

		if ($query->url(0) == 'rss') {
			return new Rss($query);
		}

		return new Html($query);
	}
}