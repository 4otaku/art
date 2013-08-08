<?php

namespace otaku\art;

class Module_Html_Comment extends Module_Html_Abstract
{
	protected function get_modules(Query $query) {
		return array(
			'list' => new Module_Html_Comment_List($query),
			'form' => new Module_Html_Comment_Form($query)
		);
	}
}


