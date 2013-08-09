<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\Base;
use Otaku\Framework\TraitOutputTpl;
use Otaku\Framework\Query;
use Otaku\Framework\Module\Container;
use Otaku\Art\TraitModuleArtList;

class Rss extends Base
{
	use TraitOutputTpl, TraitModuleArtList;

	protected $header = ['Content-type' => 'application/rss+xml'];

	protected function get_modules(Query $query) {
		return [
			'title' => new HtmlArtTitle($query),
			'list' => new Container(__NAMESPACE__ .
				'\RssThumbnail' . ucfirst($query->mode()))
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
