<?php

namespace Otaku\Art;

use Otaku\Framework\ModuleHtmlAbstract;
use Otaku\Framework\Query;

class ModuleHtmlSidebarTag extends ModuleHtmlAbstract
{
	use TraitTag;

	protected $css = ['sidebar'];

	protected function get_params(Query $query)
	{
		$this->set_param('prefix', '');
		$this->set_param('mode', false);
	}

	public function set_pool_mode($mode)
	{
		$this->set_param('prefix', 'mode=' . $mode .'&');
		$this->set_param('mode', $mode);
	}

	public function recieve_data($data) {
		usort($data, [$this, 'sort_tag']);
		foreach ($data as &$item) {
			$item['display'] = str_replace('_', ' ', $item['name']);
			$item['display'] = str_replace('<', '&lt;', $item['display']);
			$item['display'] = str_replace('>', '&gt;', $item['display']);

			if (!$item['count']) {
				$item['count'] = 0;
			}

			$item['name'] = urlencode($item['name']);
		}
		$this->set_param('data', $data);
	}
}
