<?php

class Module_Container extends Module_Html_Abstract
{
	protected $class_name;

	public function __construct($type = '', $disabled = false) {
		$type = explode('_', $type);
		$type = array_map('ucfirst', $type);
		$this->class_name = 'Module_' . implode('_', $type);

		parent::__construct(new Query_Dummy(), $disabled = false);
	}

	public function recieve_data($data) {
		$class_name = $this->class_name;
		$dummy = new Query_Dummy();
		foreach ($data as $value) {
			$module = new $class_name($dummy);
			$module->recieve_data($value);
			$this->modules[] = $module;
		}
	}

	public function get_html() {
		$return = '';
		foreach ($this->modules as $key => $module) {
			$return .= $module->get_html();
		}
		return $return;
	}
}
