<?php

abstract class Module_Html_Art_Abstract extends Module_Html_Abstract
{
	protected $query;
	protected $size_types = array('б', 'кб', 'мб', 'гб');

	public function __construct(Query $query, $disabled = false) {
		if (!($query instanceOf Query_Art)) {
			$query = new Query_Art($query);
		}
		parent::__construct($query, $disabled);

		$this->query = $query;
	}

	protected function get_common_request() {
		$params = $this->query->other();
		$params['parsed'] = $this->query->parsed();
		$params['pool_mode'] = $this->query->get_pool_mode();
		$params['pool_value'] = $this->query->get_pool_value();
		return new Request_Art_List($this, $params);
	}
}
