<?php

class Request_Art_List extends Request
{
	protected $api_modes = array(
		'comment', 'pack', 'group', 'manga',  'artist',
	);

	protected $filter_types = array(
		'rating' => 'art_rating',
		'width' => 'width',
		'height' => 'height',
		'weight' => 'weight',
		'date' => 'date',
		'tag' => 'art_tag',
		'user' => 'id_user',
		'pack' => 'art_pack',
		'group' => 'art_group',
		'artist' => 'art_artist',
		'manga' => 'art_manga',
		'md5' => 'md5',
		'state' => 'state',
	);

	public function __construct($object = false, $data = array(), $method = 'recieve_data') {
		$api = $this->fetch_api($data);
		$data = $this->translate_data($data);
		parent::__construct($api, $object, $data, $method);
	}

	protected function fetch_api($data) {
		if (!isset($data['mode']) || !in_array($data['mode'], $this->api_modes)) {
			return 'art_list';
		}

		return 'art_list_' . $data['mode'];
	}

	protected function translate_data($data) {
		if (isset($data['sort'])) {
			$data['sort_by'] = $data['sort'];
			unset($data['sort']);
		}
		if (isset($data['order'])) {
			$data['sort_order'] = $data['order'];
			unset($data['order']);
		}
		$data['filter'] = array();
		foreach ($data['parsed'] as $key => $parts) {
			if (!array_key_exists($key, $this->filter_types)) {
				continue;
			}
			foreach ($parts as $operation => $items) {
				foreach ($items as $item) {
					$data['filter'][] = array(
						'name' => $this->filter_types[$key],
						'type' => $operation,
						'value' => $item
					);
				}
			}
		}
		unset($data['parsed']);

		return $data;
	}
}
