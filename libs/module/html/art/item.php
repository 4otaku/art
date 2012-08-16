<?php

class Module_Html_Art_Item extends Module_Html_Art_Abstract
{
	protected $css = array('item', 'sidebar');

	protected function get_modules(Query $query) {
		return array(
			'title' => new Module_Html_Art_Title($query),
			'search' => new Module_Html_Art_Search($query),
			'error' => new Module_Html_Art_Error($query, true),
			'image' => new Module_Html_Art_Image($query),
			'info' => new Module_Html_Sidebar_Info($query),
			'tags' => new Module_Html_Sidebar_Tag($query),
			'recent_comments' => new Module_Html_Sidebar_Comment($query),
			'comment' => new Module_Html_Comment($query)
		);
	}

	protected function get_params(Query $query) {
		$this->set_param('query', $query->to_url_string());
	}

	protected function make_request() {
		$params = $this->query->other();
		$params['parsed'] = $this->query->parsed();
		$params['pool_mode'] = $this->query->get_pool_mode();
		$params['pool_value'] = $this->query->get_pool_value();

		$request = new Request_Art($this->query->url(0), $this);
		$request->add(new Request_Art_Nextprev($this->query->url(0),
			$this, $params, 'recieve_nextprev'));

		return $request;
	}

	public function recieve_data($data) {
		if ($data['count'] > 0) {
			$this->recieve_succesful($data['data']);
		} else {
			$this->recieve_error(!$data['success'], $data['errors']);
		}
	}

	protected function recieve_succesful($data) {
		$this->modules['image']->recieve_data($data);
		$this->modules['tags']->recieve_data($data['tag']);
	}

	protected function recieve_error($is_critical, $errors) {
		$this->modules['image']->disable();
		$this->modules['info']->disable();
		$this->modules['tags']->disable();
		$this->modules['error']->enable();
	}

	public function recieve_nextprev($data) {
		$this->set_param('next', empty($data['next']) ? false : $data['next']);
		$this->set_param('prev', empty($data['prev']) ? false : $data['prev']);
	}
}
