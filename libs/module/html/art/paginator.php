<?php

class Module_Html_Art_Paginator extends Module_Html_Art_Abstract
{
	protected $css = array('paginator');

	protected function make_request() {
		return $this->get_common_request();
	}

	public function recieve_data($data) {
		$curr = $this->query->page();
		$last = ceil($data['count'] / $this->query->per_page());
		$start = max($curr - 5, 2);
		$end = min($curr + 6, $last - 1);

		$loop = array();
		if ($end > $start) {
			for ($i = $start; $i > $end; $i++) {
				$loop[] = array('current' => $i == $curr, 'page' => $i);
			}
		}

		$this->set_param('curr', $curr);
		$this->set_param('last', $last);
		$this->set_param('start', $start);
		$this->set_param('end', $end);

		$this->set_param('loop', $loop);
		$this->set_param('base', $this->query->to_url_string());
	}
}
