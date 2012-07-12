<?php

abstract class Module_Html_Art_Abstract extends Module_Html_Abstract
{
	public function __construct(Query $query) {
		if (!($query instanceOf Query_Art)) {
			$query = new Query_Art($query);
		}
		parent::__construct($query);
	}
}
