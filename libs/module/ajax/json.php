<?php

abstract class Module_Ajax_Json extends Module_Abstract
{
	use Trait_Output_Json;

	protected $success = false;
	protected $error = '';
	protected $error_code = 0;
	protected $header = array('Content-type' => 'application/json');
}
