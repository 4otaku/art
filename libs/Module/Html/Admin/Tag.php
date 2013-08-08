<?php

namespace Otaku\Art;

class ModuleHtmlAdminTag extends ModuleHtmlAbstract
{
	protected $page = 1;
	protected $filter = '';
	protected $strict = false;
	protected $sort = 'id';
	protected $order = 'desc';
	protected $color = array(
		"" => 'Обычный',
		"AA0000" => 'Автор',
		"00AA00" => 'Персонаж',
		"AA00AA" => 'Произведение',
		"0000FF" => 'Служебный'
	);

	protected function get_params(Query $query)
	{
		if ($query->get('page')) {
			$this->page = (int) $query->get('page');
		}
		if ($query->get('filter')) {
			$this->filter = (string) $query->get('filter');
		}
		if ($query->get('strict')) {
			$this->strict = true;
		}
		if ($query->get('namesort')) {
			$this->sort = 'name';
		}
		if ($query->get('reverse')) {
			$this->order = 'asc';
		}
		$this->set_param('filter', $this->filter);
		$this->set_param('strict', $this->strict);
		$this->set_param('namesort', (bool) $query->get('namesort'));
		$this->set_param('reverse', (bool) $query->get('reverse'));
		$this->set_param('colors', $this->color);
	}

	protected function get_modules(Query $query)
	{
		return ['paginator' => new ModuleHtmlAdminPaginator($query)];
	}

	protected function make_request()
	{
		return new RequestRead('tag_art', $this, ['page' => $this->page,
			($this->strict ? 'name' : 'filter') => $this->filter,
			'sort_by' => $this->sort, 'sort_order' => $this->order]);
	}

	public function recieve_data($data)
	{
		$this->modules['paginator']->build_pager($data['count']);

		foreach ($data['data'] as &$item) {
			if (isset($this->color[$item['color']])) {
				$item['color_name'] = $this->color[$item['color']];
			} else {
				$item['color_name'] = 'Ошибка';
			}
			$item['variant'] = implode(', ', $item['variant']);
			$item['escaped_name'] = str_replace('\\', '\\\\', $item['name']);
		}
		parent::recieve_data($data);
	}
}