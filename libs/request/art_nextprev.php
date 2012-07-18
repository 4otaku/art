<?php

class Request_Art_Nextprev extends Request_Art_List
{
	public function __construct($id, $object = false, $data = array(), $method = 'recieve_data') {
		unset($data['page']);
		unset($data['per_page']);
		$data['id'] = $id;
		parent::__construct($object, $data, $method);
	}

	protected function fetch_api($data) {
		return 'art_nextprev';
	}
}
