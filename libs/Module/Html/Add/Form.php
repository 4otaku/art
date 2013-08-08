<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\HtmlAbstract;
use Otaku\Framework\Query;

class HtmlAddForm extends HtmlAbstract
{
	protected $js = ['external/upload', 'external/upload-ui', 'external/wysibb',
		'wysibb', 'ajaxtip', 'addcommon', 'add'];
	protected $css = ['external/upload', 'ajaxtip', 'add'];

	protected function get_modules(Query $query)
	{
		return [
			'template' => new HtmlAddTemplate($query),
		];
	}
}