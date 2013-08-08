<?php

namespace Otaku\Art;

use Otaku\Framework\ModuleHtmlAbstract;
use Otaku\Framework\Query;
use Otaku\Framework\TraitFile;
use Otaku\Framework\TraitDate;
use Otaku\Framework\RequestRead;

class ModuleHtmlAdminSimilar extends ModuleHtmlAbstract
{
	use TraitFile, TraitDate;

	protected $page = 1;

	protected function get_params(Query $query)
	{
		if ((int) $query->get('page')) {
			$this->page = (int) $query->get('page');
		}
	}

	protected function get_modules(Query $query)
	{
		return ['paginator' => new ModuleHtmlAdminPaginator($query)];
	}

	protected function make_request()
	{
		return new RequestRead('art_similar', $this, ['page' => $this->page]);
	}

	public function recieve_data($data)
	{
		$this->modules['paginator']->build_pager($data['count']);
		foreach ($data['data'] as &$item) {
			$item['first']['weight'] =
				$this->format_weight($item['first']['weight']);
			$item['second']['weight'] =
				$this->format_weight($item['second']['weight']);
			$item['first']['created'] =
				$this->format_time($item['first']['created']);
			$item['second']['created'] =
				$this->format_time($item['second']['created']);
		}
		parent::recieve_data($data);
	}
}