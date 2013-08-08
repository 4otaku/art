<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\HtmlAbstract;
use Otaku\Framework\Query;

class HtmlBody extends HtmlAbstract
{
	protected $css = array('base');
	protected $title = 'Материалы для отаку';

	protected function get_modules(Query $query)
	{
		if (is_numeric($query->url(0))) {
			$this->title = 'Арт №' . $query->url(0);
			return new HtmlArtItem($query);
		}

		if ($query->url(0) == 'admin') {
			$this->title = 'Админка';
			return new HtmlAdmin($query);
		}

		if ($query->url(0) == 'add') {
			$this->title = 'Загрузка новых артов';
			return new HtmlAdd($query);
		}

		if ($query->url(0) == 'add_to') {
			return new HtmlCollect($query);
		}

		return new HtmlArtList($query);
	}

	public function get_title()
	{
		return $this->title;
	}
}
