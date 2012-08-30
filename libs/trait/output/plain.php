<?php

trait Trait_Output_Plain
{
	protected function format_data() {
		return isset($this->params['module_0']) ?
			$this->params['module_0'] : '';
	}
}
