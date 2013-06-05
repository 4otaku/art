<?php

abstract class Module_Ajax_Json extends Module_Abstract
{
	use Trait_Output_Json;

	protected $header = array('Content-type' => 'application/json');
}