<?php

trait Trait_Output_Tpl
{
	abstract public function draw($tpl_name, $return_string = false);

	protected function format_data() {
		$css = $this->get_css();
		$js = $this->get_js();

		$this->set_param('css', $this->get_meta_address('css', $css));
		$this->set_param('js', $this->get_meta_address('js', $js));

		$tpl_name = explode('_', strtolower(get_called_class()));
		array_shift($tpl_name);
		$tpl_name = implode(SL, $tpl_name);

		return $this->draw($tpl_name, true);
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
