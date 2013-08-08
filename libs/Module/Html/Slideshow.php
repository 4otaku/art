<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\HtmlAbstract;
use Otaku\Framework\Query;
use Otaku\Framework\Config;
use Otaku\Art\TraitModuleArt;

class HtmlSlideshow extends HtmlAbstract
{
	use TraitModuleArt;

	protected $js = ['external/wysibb', 'wysibb', 'slideshow',
		'image', 'translation'];
	protected $css = ['item', 'slideshow'];

	protected function get_params(Query $query) {
		$this->set_param('query', $query->to_url_string());
		$this->set_param('start', max(1, $query->get('start')));
		$this->set_param('auto', Config::getInstance()->get('slideshow', 'auto'));

		$delay = Config::getInstance()->get('slideshow', 'delay');
		if ($delay < 10) {
			$delay = '0' . $delay;
		}
		$this->set_param('delay', $delay);
	}

	public function get_title()
	{
		return 'Слайдшоу';
	}
}
