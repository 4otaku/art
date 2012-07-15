<?php

abstract class Module_Html_Art_Abstract extends Module_Html_Abstract
{
	protected $query;

	public function __construct(Query $query) {
		if (!($query instanceOf Query_Art)) {
			$query = new Query_Art($query);
		}
		parent::__construct($query);

		$this->query = $query;
	}

	protected function get_common_request() {
		$params = $this->query->other();
		$params['parsed'] = $this->query->parsed();
		return new Request_Art_List($this, $params);
	}
}
