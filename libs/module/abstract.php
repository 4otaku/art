<?php

abstract class Module_Abstract extends RainTPL
{
	protected $modules = array();
	protected $params = array();

	public function __construct(Query $query) {
		RainTPL::configure('tpl_dir', HTML . SL);
		RainTPL::configure('cache_dir', CACHE . SL . 'tpl' . SL);
		RainTPL::configure('path_replace', false);

		$this->get_params($query);
		$modules = $this->get_modules($query);
		if (!is_array($modules)) {
			$modules = array($modules);
		}
		$this->modules = $modules;
	}

	protected function get_params(Query $query)
	{}

	protected function set_param($key, $value) {
		$this->assign($key, $value);
	}

	protected function get_modules(Query $query) {
		return array();
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

	public function dispatch() {
		$html = $this->get_html();

		echo $html;
	}

	public function get_html() {
		foreach ($this->modules as $key => $module) {
			$var_name = 'module_' . $key;
			$var_value = $module->get_html();
			$this->set_param($var_name, $var_value);
		}

		$tpl_name = explode('_', strtolower(get_called_class()));
		array_shift($tpl_name);
		$tpl_name = implode(SL, $tpl_name);

		return $this->draw($tpl_name, true);
	}
}
