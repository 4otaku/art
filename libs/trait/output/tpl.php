<?php

trait Trait_Output_Tpl
{
	use Trait_Output_Html;

	private $tpl = false;

	protected function format_data() {
		$css = $this->get_css();
		$js = $this->get_js();

		$this->set_param('css', $this->get_meta_address('css', $css));
		$this->set_param('js', $this->get_meta_address('js', $js));
		$this->set_param('prefetch', $this->get_prefetch());

		$tpl_name = explode('_', strtolower(get_called_class()));
		array_shift($tpl_name);
		$tpl_name = implode(SL, $tpl_name);

		return $this->get_tpl()->draw($tpl_name, true);
	}

	private function get_tpl() {
		if (empty($this->tpl)) {
			$this->tpl = new RainTPL();
		}

		return $this->tpl;
	}

	protected function set_param($key, $value) {
		parent::set_param($key, $value);
		$this->get_tpl()->assign($key, $value);
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
