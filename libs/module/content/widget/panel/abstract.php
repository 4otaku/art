<?php

abstract class Module_Content_Widget_Panel_Abstract extends Module_Html_Abstract
{
	public function __construct(Query $query, $id, $align) {
		parent::__construct($query);

		$this->set_param('id', $id);
		$this->set_param('align', $align);

		$class = explode('_', get_class($this));
		$type = array_pop($class);

		$this->set_param('type', strtolower($type));
	}
}
