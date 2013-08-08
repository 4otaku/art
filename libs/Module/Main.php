<?php

namespace Otaku\Art;

use Otaku\Framework\ModuleAbstract;
use Otaku\Framework\ModuleAjax;
use Otaku\Framework\ModuleDownload;
use Otaku\Framework\Query;
use Otaku\Framework\TraitOutputPlain;

class ModuleMain extends ModuleAbstract
{
	use TraitOutputPlain;

	protected function get_modules(Query $query) {
		if ($query->url(0) == 'download') {
			return new ModuleDownload($query);
		}

		if ($query->url(0) == 'ajax') {
			return new ModuleAjax($query);
		}

		if ($query->url(0) == 'rss') {
			return new ModuleRss($query);
		}

		return new ModuleHtml($query);
	}
}