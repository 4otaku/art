<?php

class Module_Html_Art_List extends Module_Html_Art_Abstract
{
	protected $css = array('list', 'sidebar');
	protected $js = array();
	protected $query_params = array();

	protected function get_modules(Query $query) {
		return array(
			'title' => new Module_Html_Art_Title($query),
			'search' => new Module_Html_Art_Search($query),
			'error' => new Module_Html_Art_Error($query, true),
			'paginator' => new Module_Html_Art_Paginator($query),
			'list' => new Module_Html_Container('thumbnail_' . $query->mode()),
			'tags' =>new Module_Html_Sidebar_Tags($query)
		);
	}

	protected function make_request() {
		return $this->get_common_request();
	}

	public function recieve_data($data) {
		if ($data['count'] > 0) {
			$this->recieve_succesful($data['data']);
		} else {
			$this->recieve_error(!$data['success'], $data['errors']);
		}
	}

	protected function recieve_succesful($data) {
		$query = $this->query->to_url_string();
		foreach ($data as &$item) {
			$item['query'] = $query;
		}
		unset($item);

		$temp_tags = array();
		$count = array();
		foreach ($data as $item) {
			foreach ($item['tag'] as $tag) {
				$temp_tags[$tag['name']] = $tag;
				$count[$tag['name']] = $tag['count'];
			}
		}
		arsort($count);
		$count = array_slice($count, 0, Config::get('pp', 'art_tags'), true);

		$tags = array();
		foreach ($count as $key => $count) {
			$tags[] = $temp_tags[$key];
		}

		$this->modules['list']->recieve_data($data);
		$this->modules['tags']->recieve_data($tags);
	}

	protected function recieve_error($is_critical, $errors) {
		if ($is_critical) {
			$this->modules['error']->recieve_data($errors);
		}

		$this->modules['list']->disable();
		$this->modules['tags']->disable();
		$this->modules['paginator']->disable();
		$this->modules['error']->enable();
	}
}
