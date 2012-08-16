<?php

class Module_Html_Art_Paginator extends Module_Html_Art_Abstract
{
	protected $css = array('paginator');

	protected function make_request() {
		return $this->get_common_request();
	}

	protected function get_page() {
		return $this->query->page();
	}

	protected function get_per_page() {
		return $this->query->per_page();
	}

	public function recieve_data($data) {
		$curr = $this->get_page();
		$last = ceil($data['count'] / $this->get_per_page());
		$start = max($curr - 8, 2);
		$end = min($curr + 9, $last - 1);

		$loop = array();
		if ($end >= $start) {
			for ($i = $start; $i <= $end; $i++) {
				$loop[] = array('current' => $i == $curr, 'page' => $i);
			}
		}

		$url_string = $this->query->to_url_string();
		if (!empty($url_string)) {
			$url_string .= '&';
		}

		$this->set_param('curr', $curr);
		$this->set_param('last', $last);
		$this->set_param('start', $start);
		$this->set_param('end', $end);

		$this->set_param('loop', $loop);
		$this->set_param('base', $url_string);
	}
}
