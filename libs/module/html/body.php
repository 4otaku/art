<?php

namespace otaku\art;

class Module_Html_Body extends Module_Html_Abstract
{
	protected $css = array('base');
	protected $title = 'Материалы для отаку';

	protected function get_modules(Query $query)
	{
		if (is_numeric($query->url(0))) {
			$this->title = 'Арт №' . $query->url(0);
			return new Module_Html_Art_Item($query);
		}

		if ($query->url(0) == 'admin') {
			$this->title = 'Админка';
			return new Module_Html_Admin($query);
		}

		if ($query->url(0) == 'add') {
			$this->title = 'Загрузка новых артов';
			return new Module_Html_Add($query);
		}

		if ($query->url(0) == 'add_to') {
			return new Module_Html_Collect($query);
		}

		return new Module_Html_Art_List($query);
	}

	public function get_title()
	{
		return $this->title;
	}
}
