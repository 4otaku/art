<?php

abstract class Module_Abstract extends RainTPL
{
	public function __construct(Query $query)
	{
		RainTPL::configure('tpl_dir', HTML);
		RainTPL::configure('cache_dir', CACHE . SL . 'tpl');

		var_dump($query);
	}

	public function gather_request()
	{

	}
}
