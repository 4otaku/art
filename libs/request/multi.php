<?php

class Request_Multi extends Request
{
	public function __construct() {
		parent::__construct();
		foreach (func_get_args() as $requests) {
			if (!is_array($requests)) {
				$requests = [$requests];
			}
			foreach ($requests as $request) {
				$this->add($request);
			}
		}
	}
}
