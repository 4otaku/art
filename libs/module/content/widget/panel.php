<?php

class Module_Content_Widget_Panel extends Module_Content_Widget_Abstract
{
	protected $prefix = 'panel';

	protected function get_widgets () {
		$widgets = parent::get_widgets();

		$left = array();
		$right = array();
		$max_id = 0;
		foreach ($widgets as $widget) {
			if ($widget['align'] == 'left') {
				$left[] = $widget;
			} else {
				$right[] = $widget;
			}
			$max_id = max($max_id, $widget['id']);
		}

		if (count($left) != count($right)) {
			while (count($right) > count($left)) {
				$left[] = array(
					'align' => 'left', 'type' => 'empty',
					'id' => ++$max_id
				);
			}
			while (count($left) > count($right)) {
				$right[] = array(
					'align' => 'right', 'type' => 'empty',
					'id' => ++$max_id
				);
			}
		}

		$return = array();
		for ($i = 0; $i < count($right); $i++) {
			$return['left_' . ($i+1)] = $left[$i];
			$return['right_' . ($i+1)] = $right[$i];
		}

		return $return;
	}

	protected function get_modules(Query $query) {
		$panels = $this->get_widgets();

		foreach ($panels as &$panel) {
			$class = 'Module_Content_Widget_Panel_' . ucfirst($panel['type']);
			$panel = new $class($query, $panel['id'], $panel['align']);
		}

		return $panels;
	}

	protected function get_module_html() {
		parent::get_module_html();

		$loop = array();
		foreach ($this->modules as $key => $module) {
			$var_name = 'module_' . $key;
			$key = explode('_', $key);
			$loop[$key[1]][$key[0]] = $this->var[$var_name];
		}
		$this->set_param('loop', $loop);
	}
}
