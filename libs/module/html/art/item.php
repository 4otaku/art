<?php

class Module_Html_Art_Item extends Module_Html_Art_Abstract
{
	protected $css = array('item');
	protected $js = array('item');

	protected function make_request() {
		$params = array(
			'add_tags' => 1,
			'add_translations' => 1,
			'add_comments' => 1,
			'add_similar' => 1,
			'add_groups' => 1,
			'add_manga' => 1,
			'add_pack' => 1,
			'add_artist' => 1,
			'id' => $this->query->url(0),
		);

		return new Request_Item('art', $this, $params);
	}

	public function recieve_data($data) {
		parent::recieve_data($data['data']);
	}
}
