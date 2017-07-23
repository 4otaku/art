<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\HtmlAbstract;
use Otaku\Framework\Query;
use Otaku\Art\TraitModulePaginator;

class HtmlAdminPaginator extends HtmlAbstract
{
	use TraitModulePaginator;

	protected $css = array('paginator');
	protected $page = 1;
	protected $base_url = '/';

	protected function get_params(Query $query)
	{
		if ($query->get('page')) {
			$this->page = (int) $query->get('page');
		}

		$this->base_url = '/' . implode('/', $query->url()) . '?';
		$get = $query->get();
		unset($get['page']);
		$this->base_url .= http_build_query($get);
	}

	protected function get_page()
	{
		return $this->page;
	}

	protected function get_per_page()
	{
		return 20;
	}

	protected function get_url()
	{
		return $this->base_url;
	}
}