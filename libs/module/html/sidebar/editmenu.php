<?php

class Module_Html_Sidebar_Editmenu extends Module_Html_Abstract
{
	use Trait_Module_Art;

	protected $js = ['edit'];
	protected $css = ['sidebar'];
	protected $id_artist;
	protected $id_art;

	protected function get_params(Query $query) {
		$this->set_param('is_variation_list', false);
		if (is_numeric($query->url(0))) {
			$this->set_param('mode', false);
			$this->set_param('id', $query->url(0));

			$this->id_art = $query->url(0);
		} else {
			if (!$query->get_pool_mode()) {
				if (!$query->is_variation_list() || !Session::is_moderator()) {
					$this->disable();
				} else {
					$this->set_param('is_variation_list', true);
					$this->set_param('id', $query->get('parent'));
				}
			} else {
				$this->set_param('mode', $query->get_pool_mode());
				$this->set_param('id', $query->get_pool_value());
				if ($query->get_pool_mode() == 'artist') {
					$this->id_artist = $query->get_pool_value();
				}
				if ($query->is_pool_full_view()) {
					$this->set_param('is_list', true);
				} else {
					$this->set_param('is_list', false);
					$this->set_param('list_link', $query->get_pool_mode() . '=' .
						$query->get_pool_value() . '&per_page=all');
				}
			}
		}

		$this->set_param('moderator', Session::is_moderator());
	}

	protected function make_request()
	{
		if ($this->id_artist) {
			return new Request_Item('art_artist', $this,
				['id' => $this->id_artist], 'recieve_artist');
		} elseif ($this->id_art) {
			return new Request_Art($this->id_art, $this, 'recieve_art');
		} else {
			$this->set_param('is_author', false);
			return [];
		}
	}

	public function recieve_artist($data) {
		$this->set_param('is_author', $data['data']['is_author']);
		if ($this->id_artist &&
			!$data['data']['is_author'] &&
			!Session::is_moderator()) {

			$this->disable();
		}
	}

	public function recieve_art($data) {
		$parent = $data['data']['id_parent'];
		$this->set_param('variation_link', 'parent=' . $parent .
			'&sort=parent_order&order=asc&per_page=all');
		$this->set_param('id_parent', $parent);

		if (!isset($data['data']['artist'][0]['id'])) {
			$this->set_param('is_author', false);
			return;
		}

		$user = Session::get_instance()->get_data();

		$this->set_param('is_author', $data['data']['artist'][0]['id'] ==
			$user['user']['gallery']);
	}

	public function recieve_additional($data) {
		$this->set_param('voted', $data['voted'] != 0);
		$this->set_param('have_translation', !empty($data['translation']));
		$this->set_param('have_source', !empty($data['source']));
	}
}