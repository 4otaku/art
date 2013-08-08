<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\HtmlAbstract;
use Otaku\Framework\Query;

class HtmlFooter extends HtmlAbstract
{
	protected $css = array('base', 'footer');

	protected function get_params(Query $query)
	{
		$this->set_param('year', date('Y'));
	}
}
