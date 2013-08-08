<?php

namespace Otaku\Art;

class ModuleHtmlArtList extends ModuleHtmlArtAbstract
{
	use TraitModuleArtList;

	protected $css = ['list', 'sidebar'];
	protected $js = ['list'];

	protected $pool_tag_request = false;

	protected function get_modules(Query $query) {
		$return = array(
			'title' => new ModuleHtmlArtTitle($query),
			'search' => new ModuleHtmlArtSearch($query),
			'error' => new ModuleHtmlArtError($query, true),
			'list' => new ModuleContainer('html_thumbnail_' . $query->mode()),
			'tags' => new ModuleHtmlSidebarTag($query),
			'tags_pool' => new ModuleHtmlSidebarTag($query),
			'editmenu' => new ModuleHtmlSidebarEditmenu($query),
			'editfield' => new ModuleHtmlArtEditfield($query),
			'tools' => new ModuleHtmlSidebarTool($query),
			'recent_comments' => new ModuleHtmlSidebarComment($query),
			'paginator' => new ModuleHtmlArtPaginator($query),
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
			$request->add(new RequestItem($this->pool_tag_request['api'], $this,
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
		$count = array_slice($count, 0, Config::get('sidebar', 'tags'), true);

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
