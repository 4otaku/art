<?php

class Module_Html_Admin_Similar extends Module_Html_Abstract
{
	use Trait_File, Trait_Date;

	protected $page = 1;

	protected function get_params(Query $query)
	{
		if ((int) $query->get('page')) {
			$this->page = (int) $query->get('page');
		}
	}

	protected function get_modules(Query $query)
	{
		return ['paginator' => new Module_Html_Admin_Paginator($query)];
	}

	protected function make_request()
	{
		return new Request('art_similar', $this, ['page' => $this->page]);
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