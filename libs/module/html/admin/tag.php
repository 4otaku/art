<?php

class Module_Html_Admin_Tag extends Module_Html_Abstract
{
	protected $page = 1;
	protected $filter = '';
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
	}

	protected function make_request()
	{
		return new Request('art_tag', $this, ['page' => $this->page,
			'filter' => $this->filter]);
	}

	public function recieve_data($data)
	{
		foreach ($data['data'] as &$item) {
			if (isset($this->color[$item['color']])) {
				$item['color_name'] = $this->color[$item['color']];
			} else {
				$item['color_name'] = 'Ошибка';
			}
			$item['variant'] = implode(', ', $item['variant']);
		}
		parent::recieve_data($data);
	}
}