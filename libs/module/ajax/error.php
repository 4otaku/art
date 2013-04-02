<?php

class Module_Ajax_Error extends Module_Abstract
{
	use Trait_Output_Plain;
	protected $header = ['status' => 404];
}
