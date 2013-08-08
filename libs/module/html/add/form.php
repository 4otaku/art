<?php

namespace otaku\art;

class Module_Html_Add_Form extends Module_Html_Abstract
{
	protected $js = ['external/upload', 'external/upload-ui', 'external/wysibb',
		'wysibb', 'ajaxtip', 'addcommon', 'add'];
	protected $css = ['external/upload', 'ajaxtip', 'add'];

	protected function get_modules(Query $query)
	{
		return [
			'template' => new Module_Html_Add_Template($query),
		];
	}
}