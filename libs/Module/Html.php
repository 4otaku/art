<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\HtmlAbstract;
use Otaku\Framework\Database;
use Otaku\Framework\Query;
use Otaku\Framework\Config;

class Html extends HtmlAbstract
{
	protected $css = ['external/bootstrap', 'external/plugins'];
	protected $js = ['external/jquery', 'external/bootstrap', 'external/plugins', 'base'];

	protected function get_params(Query $query) {
		$plugins = Database::get_vector('plugin', array('id', 'filename',
			'css', 'js', 'script'));
		$enabled = (array) Config::getInstance()->get('plugins');

		$js = [];
		$css = [];
		$script = [];
		foreach ($plugins as $id => $plugin) {
			if (empty($enabled[$id])) {
				continue;
			}

			if ($plugin['js']) {
				$js[] = $plugin['filename'];
			}
			if ($plugin['css']) {
				$css[] = $plugin['filename'];
			}
			if ($plugin['script']) {
				$script[] = file_get_contents(JS . SL . 'plugins' .
					SL . $plugin['filename'] . '.head.js');
			}
		}

		$this->set_param('plugin_css', $this->get_meta_address('css', $css,
			'plugins'));
		$this->set_param('plugin_js', $this->get_meta_address('js', $js,
			'plugins'));
		$this->set_param('plugin_script', $script);
	}

	protected function get_modules(Query $query) {
		if ($query->url(0) == 'slideshow') {
			return array(
				'body' => new HtmlSlideshow($query)
			);
		}

		return array(
			'header' => new HtmlHeader($query),
			'body' => new HtmlBody($query),
			'footer' => new HtmlFooter($query)
		);
	}

	public function get_data() {
		$this->set_param('title', $this->modules['body']->get_title());
		return parent::get_data();
	}
}
