<?php

abstract class Module_Abstract
{
	protected $modules = [];
	protected $params = [];
	protected $header = [];
	protected $css = [];
	protected $js = [];
	protected $status_headers = [
		200 => 'HTTP/1.1 200 OK',
		201 => 'HTTP/1.1 201 Created',
		204 => 'HTTP/1.1 204 No Content',
		206 => 'HTTP/1.1 206 Partial Content',
		301 => 'HTTP/1.1 301 Moved Permanently',
		302 => 'HTTP/1.1 302 Found',
		304 => 'HTTP/1.1 304 Not Modified',
		307 => 'HTTP/1.1 307 Temporary Redirect',
		400 => 'HTTP/1.1 400 Bad Request',
		401 => 'HTTP/1.1 401 Unauthorized',
		403 => 'HTTP/1.1 403 Forbidden',
		404 => 'HTTP/1.1 404 Not Found',
		500 => 'HTTP/1.1 500 Internal Server Error',
		501 => 'HTTP/1.1 501 Not Implemented',
		503 => 'HTTP/1.1 503 Service Unavailable',
		504 => 'HTTP/1.1 504 Gateway Time-out',
	];
	protected $disabled = false;

	public function __construct(Query $query, $disabled = false) {
		$query = $this->preprocess_query($query);
		$this->get_params($query);
		$modules = $this->get_modules($query);
		if (!is_array($modules)) {
			$modules = [$modules];
		}
		$this->modules = $modules;

		$this->disabled = (bool) $disabled;
	}

	protected function preprocess_query(Query $query)
	{
		return $query;
	}

	protected function get_params(Query $query)
	{}

	protected function set_param($key, $value) {
		$this->params[$key] = $value;
	}

	protected function set_params($data) {
		foreach ($data as $key => $value) {
			$this->set_param($key, $value);
		}
	}

	protected function get_modules(Query $query) {
		return array();
	}

	public function disable() {
		$this->disabled = true;
	}

	public function enable() {
		$this->disabled = false;
	}

	public function gather_request() {
		$request = new Request();

		foreach ($this->modules as $module) {
			$request->add($module->gather_request());
		}

		$request->add($this->make_request());

		return $request;
	}

	protected function make_request() {
		return false;
	}

	public function recieve_data($data) {
		foreach ($data as $key => $value) {
			$this->set_param($key, $value);
		}
	}

	public function get_header() {
		$header = (array) $this->header;

		foreach ($this->modules as $module) {
			$header = array_merge($module->get_header(), $header);
		}

		return $header;
	}

	public function dispatch() {
		foreach ($this->get_header() as $key => $header) {
			if ($key == 'status') {
				header($this->status_headers[$header]);
			} else {
				header($key . ': ' . $header);
			}
		}

		$output = $this->get_data();

		echo trim($output);
	}

	public function get_data() {
		if ($this->disabled) {
			return '';
		}

		$this->get_module_data();
		return $this->format_data();
	}

	abstract protected function format_data();

	protected function get_module_data() {
		foreach ($this->modules as $key => $module) {
			$var_name = 'module_' . $key;
			$var_value = $module->get_data();
			$this->set_param($var_name, $var_value);
		}
	}
}
