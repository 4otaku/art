<?php

class Query
{
	protected $url = array();
	protected $get = array();

	public function __construct($url, $get) {
		$this->get = $this->clean_globals($get, array());;

		$url = explode('/', preg_replace('/\?[^\/]+$/', '', $url));

		if (isset($url[0])) {
			array_shift($url);
		}
		if (empty($url[0])) {
			$url[0] = 'index';
		}

		$this->url = $url;
	}

	protected function clean_globals($data, $input = array(), $iteration = 0) {
		if ($iteration > 10) {
			return $input;
		}

		foreach ($data as $k => $v) {

			if (is_array($v)) {
				$input[$k] = $this->clean_globals($data[$k], array(), $iteration + 1);
			} else {
				$v = stripslashes($v);

				$v = str_replace(chr('0'),'',$v);
				$v = str_replace("\0",'',$v);
				$v = str_replace("\x00",'',$v);
				$v = str_replace('%00','',$v);
				$v = str_replace("../","&#46;&#46;/",$v);

				$input[$k] = $v;
			}
		}

		return $input;
	}
}
