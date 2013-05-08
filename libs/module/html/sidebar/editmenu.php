<?php

class Module_Html_Sidebar_Editmenu extends Module_Html_Abstract
{
	use Trait_Module_Art;

	protected $js = ['edit'];
	protected $css = ['sidebar'];
	protected $id_artist;

	protected function get_params(Query $query) {
		$this->set_param('is_variation_list', false);
		if (is_numeric($query->url(0))) {
			$this->set_param('mode', false);
			$this->set_param('id', $query->url(0));

			$this->set_param('variation_link', 'parent=' . $query->url(0) .
				'&sort=parent_order&order=asc&per_page=all');
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
				['id' => $this->id_artist]);
		} else {
			$this->set_param('is_author', false);
			return [];
		}
	}

	public function recieve_data($data) {
		$this->set_param('is_author', $data['data']['is_author']);
	}

	public function recieve_additional($data) {
		$this->set_param('voted', $data['voted'] != 0);
		$this->set_param('have_translation', !empty($data['translation']));
		$this->set_param('have_source', !empty($data['source']));
	}
}