<?php

abstract class Module_Html_Abstract extends Module_Abstract
{
	protected $css = array();
	protected $js = array();

	public function get_html() {
		$css = $this->get_css();
		$js = $this->get_js();

		$this->set_param('css', $this->get_meta_address('css', $css));
		$this->set_param('js', $this->get_meta_address('js', $js));

		return parent::get_html();
	}

	public function get_css() {
		$css = (array) $this->css;

		foreach ($this->modules as $module) {
			$css = array_merge($css, $module->get_css());
		}

		return array_unique($css);
	}

	public function get_js() {
		$js = (array) $this->js;

		foreach ($this->modules as $module) {
			$js = array_merge($js, $module->get_js());
		}

		return array_unique($js);
	}

	protected function get_meta_address($type, $array) {
		if (empty($array)) {
			return false;
		}

		$time = 0;
		$base = $type == 'js' ? JS . SL : CSS . SL;
		foreach ($array as &$file) {
			$file = $file . '.' . $type;
			$time = max($time, filemtime($base . $file));
		}

		return implode(',', $array) . '&ver=' . $time;
	}
}
