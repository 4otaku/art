<?php

namespace Otaku\Art;

class ModuleHtmlBody extends ModuleHtmlAbstract
{
	protected $css = array('base');
	protected $title = 'Материалы для отаку';

	protected function get_modules(Query $query)
	{
		if (is_numeric($query->url(0))) {
			$this->title = 'Арт №' . $query->url(0);
			return new ModuleHtmlArtItem($query);
		}

		if ($query->url(0) == 'admin') {
			$this->title = 'Админка';
			return new ModuleHtmlAdmin($query);
		}

		if ($query->url(0) == 'add') {
			$this->title = 'Загрузка новых артов';
			return new ModuleHtmlAdd($query);
		}

		if ($query->url(0) == 'add_to') {
			return new ModuleHtmlCollect($query);
		}

		return new ModuleHtmlArtList($query);
	}

	public function get_title()
	{
		return $this->title;
	}
}
