<?php

namespace otaku\art;

class Module_Html_Slideshow extends Module_Html_Abstract
{
	use Trait_Module_Art;

	protected $js = ['external/wysibb', 'wysibb', 'slideshow',
		'image', 'translation'];
	protected $css = ['item', 'slideshow'];

	protected function get_params(Query $query) {
		$this->set_param('query', $query->to_url_string());
		$this->set_param('start', max(1, $query->get('start')));
		$this->set_param('auto', Config::get('slideshow', 'auto'));

		$delay = Config::get('slideshow', 'delay');
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
