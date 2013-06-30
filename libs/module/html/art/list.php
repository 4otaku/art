<?php

class Module_Html_Art_List extends Module_Html_Art_Abstract
{
	use Trait_Module_Art_List;

	protected $css = ['list', 'sidebar'];
	protected $js = ['list'];

	protected $pool_tag_request = false;

	protected function get_modules(Query $query) {
		$return = array(
			'title' => new Module_Html_Art_Title($query),
			'search' => new Module_Html_Art_Search($query),
			'error' => new Module_Html_Art_Error($query, true),
			'list' => new Module_Container('html_thumbnail_' . $query->mode()),
			'tags' => new Module_Html_Sidebar_Tag($query),
			'tags_pool' => new Module_Html_Sidebar_Tag($query),
			'editmenu' => new Module_Html_Sidebar_Editmenu($query),
			'editfield' => new Module_Html_Art_Editfield($query),
			'tools' => new Module_Html_Sidebar_Tool($query),
			'recent_comments' => new Module_Html_Sidebar_Comment($query),
			'paginator' => new Module_Html_Art_Paginator($query),
		);

		if ($query->is_pool_list()) {
			$return['tags']->set_pool_mode($query->mode());
			$return['tags_pool']->disable();
			$return['editmenu']->disable();
		} elseif ($query->get_pool_mode()) {
			$return['tags_pool']->set_pool_mode($query->get_pool_mode());
			$this->pool_tag_request = ['api' => 'art_' . $query->get_pool_mode(),
				'id' => $query->get_pool_value()];
		} else {
			$return['tags_pool']->disable();
		}

		return $return;
	}

	protected function make_request() {
		$request = $this->get_common_request();
		if ($this->pool_tag_request) {
			$request->add(new Request_Item($this->pool_tag_request['api'], $this,
				['id' => $this->pool_tag_request['id'], 'add_tags' => 1],
				'recieve_pool_tags'));
		}
		return $request;
	}

	public function recieve_data($data) {
		if ($data['count'] > 0) {
			$this->recieve_succesful($data['data']);
		} else {
			$this->recieve_error(!$data['success'], $data['errors']);
		}
	}

	public function recieve_pool_tags($data) {
		$this->modules['tags_pool']->recieve_data($data['data']['tag']);
	}

	protected function recieve_succesful($data) {
		$query = $this->get_query()->to_url_array();
		$pos = ($this->get_query()->page() - 1) * $this->get_query()->per_page();
		foreach ($data as &$item) {
			$pos++;
			$item['query'] = implode('&',
				array_merge(array('pos=' . $pos), $query));
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
