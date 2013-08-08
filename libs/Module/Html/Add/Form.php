<?php

namespace Otaku\Art;

class ModuleHtmlAddForm extends ModuleHtmlAbstract
{
	protected $js = ['external/upload', 'external/upload-ui', 'external/wysibb',
		'wysibb', 'ajaxtip', 'addcommon', 'add'];
	protected $css = ['external/upload', 'ajaxtip', 'add'];

	protected function get_modules(Query $query)
	{
		return [
			'template' => new ModuleHtmlAddTemplate($query),
		];
	}
}