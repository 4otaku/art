<?php

class Module_Html_Collect extends Module_Html_Collect_Abstract
{
	protected $css = ['collect'];

	protected function get_modules(Query $query)
	{
		$valid = $this->is_valid();

		return [
			'title' => new Module_Html_Collect_Title($query, !$valid),
			'search' => new Module_Html_Collect_Search($query, !$valid),
			'add' => new Module_Html_Collect_Add($query, !$valid),
			'error' => new Module_Html_Collect_Error($query, $valid)
		];
	}
}
