<?php

class Request_Art extends Request_Item
{
	public function __construct($id, $object) {
		$params = array(
			'add_tags' => true,
			'add_state' => true,
			'add_translations' => true,
			'add_similar' => true,
			'add_groups' => true,
			'add_manga' => true,
			'add_packs' => true,
			'add_artist' => true,
			'id' => $id,
		);
		parent::__construct('art', $object, $params);
	}
}
