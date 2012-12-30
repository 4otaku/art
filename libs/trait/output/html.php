<?php

trait Trait_Output_Html
{
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

	public function get_prefetch() {
		$prefetch = [];

		foreach ($this->modules as $module) {
			$prefetch = array_merge($prefetch,
				(array) $module->get_prefetch());
		}

		return array_unique($prefetch);
	}
}