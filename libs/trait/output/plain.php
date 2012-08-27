<?php

trait Trait_Output_Plain
{
	protected function format_data() {
		return isset($this->var['module_0']) ?
			$this->var['module_0'] : 0;
	}
}
