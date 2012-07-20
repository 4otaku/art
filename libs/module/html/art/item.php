<?php

class Module_Html_Art_Item extends Module_Html_Art_Abstract
{
	protected $css = array('item', 'sidebar');
	protected $js = array('item');

	protected function get_modules(Query $query) {
		return array(
			'info' => new Module_Html_Sidebar_Info($query),
			'tags' => new Module_Html_Sidebar_Tags($query),
			'comment' => new Module_Html_Art_Comment($query),
		);
	}

	protected function get_params(Query $query) {
		$this->set_param('query', $query->to_url_string());
	}

	protected function make_request() {
		$params = $this->query->other();
		$params['parsed'] = $this->query->parsed();
		$params['pool_mode'] = (bool) $this->query->get_pool_mode();

		$request = new Request_Art($this->query->url(0), $this);
		$request->add(new Request_Art_Nextprev($this->query->url(0),
			$this, $params, 'recieve_nextprev'));

		return $request;
	}

	public function recieve_data($data) {
		parent::recieve_data($data['data']);
		$this->modules['tags']->recieve_data($data['data']['tag']);
	}

	public function recieve_nextprev($data) {
		$this->set_param('next', empty($data['next']) ? false : $data['next']);
		$this->set_param('prev', empty($data['prev']) ? false : $data['prev']);
	}
}
