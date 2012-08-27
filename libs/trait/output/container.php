<?php

trait Trait_Output_Container
{
	protected function format_data() {
		$return = '';
		foreach ($this->var as $key => $module) {
			if (strpos($key, 'module_') === 0) {
				$return .= $module;
			}
		}
		return $return;
	}
}



