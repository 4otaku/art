<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\HtmlAbstract;
use Otaku\Framework\Query;
use Otaku\Art\TraitModuleArtList;

class HtmlSidebarTool extends HtmlAbstract
{
	use TraitModuleArtList;

	protected $css = ['sidebar', 'setting'];
	protected $js = ['setting'];

	protected function get_params(Query $query) {
		$this->set_param('query', $query->to_url_string());
		$this->set_param('mode', $query->get('mode'));
		$this->set_param('slideshow_enabled',
			(!$query->get('mode') || $query->get('mode') == 'art'));
	}

	protected function make_request() {
		return $this->get_common_request();
	}

	public function recieve_data($data) {
		$this->set_param('count', (int) $data['count']);
	}
}
