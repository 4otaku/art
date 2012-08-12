<?php

abstract class Module_Abstract extends RainTPL
{
	protected $modules = array();
	protected $disabled = false;

	public function __construct(Query $query, $disabled = false) {
		RainTPL::configure('tpl_dir', TPL . SL);
		RainTPL::configure('cache_dir', CACHE . SL . 'tpl' . SL);
		RainTPL::configure('path_replace', false);

		$this->get_params($query);
		$modules = $this->get_modules($query);
		if (!is_array($modules)) {
			$modules = array($modules);
		}
		$this->modules = $modules;

		$this->disabled = (bool) $disabled;
	}

	protected function get_params(Query $query)
	{}

	protected function set_param($key, $value) {
		$this->assign($key, $value);
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

	public function dispatch() {
		$html = $this->get_html();

		echo trim($html);
	}

	public function get_html() {
		if ($this->disabled) {
			return '';
		}

		$this->get_module_html();

		$tpl_name = explode('_', strtolower(get_called_class()));
		array_shift($tpl_name);
		$tpl_name = implode(SL, $tpl_name);

		return $this->draw($tpl_name, true);
	}

	protected function get_module_html() {
		foreach ($this->modules as $key => $module) {
			$var_name = 'module_' . $key;
			$var_value = $module->get_html();
			$this->set_param($var_name, $var_value);
		}
	}
}
