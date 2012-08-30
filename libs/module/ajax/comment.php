<?php

class Module_Ajax_Comment extends Module_Abstract
{
	use Trait_Output_Tpl;

	protected function get_modules(Query $query) {
		return new Module_Html_Comment_List($query);
	}
}
