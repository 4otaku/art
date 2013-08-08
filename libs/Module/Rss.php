<?php

namespace Otaku\Art;

use Otaku\Framework\ModuleAbstract;
use Otaku\Framework\TraitOutputTpl;
use Otaku\Framework\Query;
use Otaku\Framework\ModuleContainer;

class ModuleRss extends ModuleAbstract
{
	use TraitOutputTpl, TraitModuleArtList;

	protected $header = ['Content-type' => 'application/rss+xml'];

	protected function get_modules(Query $query) {
		return [
			'title' => new ModuleHtmlArtTitle($query),
			'list' => new ModuleContainer('rss_thumbnail_' . $query->mode())
		];
	}

	protected function make_request() {
		return $this->get_common_request();
	}

	protected function get_params(Query $query) {
		$this->set_param('query', $query->to_url_string());
		$this->set_param('domain', $_SERVER['SERVER_NAME']);
	}

	public function recieve_data($data) {
		$this->modules['list']->recieve_data($data['data']);
	}
}
