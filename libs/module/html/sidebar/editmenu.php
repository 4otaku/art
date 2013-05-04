<?php

class Module_Html_Sidebar_Editmenu extends Module_Html_Abstract
{
	use Trait_Module_Art;

	protected $js = ['edit'];
	protected $css = ['sidebar'];
	protected $id_artist;

	protected function get_params(Query $query) {
		if (is_numeric($query->url(0))) {
			$this->set_param('mode', false);
			$this->set_param('id', $query->url(0));
		} else {
			$this->set_param('mode', $query->get_pool_mode());
			$this->set_param('id', $query->get_pool_value());
			if ($query->get_pool_mode() == 'artist') {
				$this->id_artist = $query->get_pool_value();
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
		if (!$data['data']['is_author'] && !Session::is_moderator()) {
			$this->disable();
		}
		$this->set_param('is_author', $data['data']['is_author']);
	}

	public function recieve_additional($data) {
		$this->set_param('voted', $data['voted'] != 0);
		$this->set_param('have_translation', !empty($data['translation']));
		$this->set_param('have_source', !empty($data['source']));
	}
}