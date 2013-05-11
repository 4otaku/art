<?php

class Request_Art_List extends Request
{
	protected $stateful_api = true;
	protected $default_approved_state = 'yes';
	protected $default_tagged_state = 'yes';

	protected $api_modes = array(
		'comment', 'translation', 'pack', 'group', 'manga',  'artist',
	);

	protected $pool_sorted = array(
		'pack' => 'asc',
		'group' => 'desc',
		'manga' => 'asc',
	);

	protected $filter_types = array(
		'rating' => 'art_rating',
		'width' => 'width',
		'height' => 'height',
		'weight' => 'weight',
		'date' => 'date',
		'tag' => 'art_tag',
		'user' => 'user',
		'translator' => 'translator',
		'translation_date' => 'translation_date',
		'tag_count' => 'tag_count',
		'comment_count' => 'comment_count',
		'comment_date' => 'comment_date',
		'pack' => 'art_pack',
		'group' => 'art_group',
		'artist' => 'art_artist',
		'manga' => 'art_manga',
		'md5' => 'md5',
		'id' => 'id',
		'parent' => 'id_parent',
		'state' => 'state',
	);

	protected $approved_filters = array(
		'yes' => array('is' => 'approved'),
		'no' => array('is' => 'disapproved'),
		'waiting' => array('is' => 'unapproved'),
		'all' => array(),
	);

	protected $tagged_filters = array(
		'yes' => array('is' => 'tagged'),
		'no' => array('is' => 'untagged'),
		'all' => array(),
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

		if ($data['mode'] != 'comment' && $data['mode'] != 'translated') {
			$this->stateful_api = false;
		} elseif ($data['mode'] == 'comment') {
			$this->default_approved_state = 'all';
			$this->default_tagged_state = 'all';
		}

		return 'art_list_' . $data['mode'];
	}

	protected function translate_data($data) {
		if (isset($data['sort'])) {
			$data['sort_by'] = $data['sort'];
			unset($data['sort']);
		} elseif (
			!empty($data['pool_mode']) &&
			isset($data['pool_value']) &&
			array_key_exists($data['pool_mode'], $this->pool_sorted)
		) {
			$data['sort_by'] = $data['pool_mode'];
			$data['sort_value'] = $data['pool_value'];
			$data['sort_order'] = $this->pool_sorted[$data['pool_mode']];
		}

		if (isset($data['order'])) {
			$data['sort_order'] = $data['order'];
			unset($data['order']);
		}
		if (isset($data['variations']) && $data['variations'] == 'yes') {
			$data['no_group'] = 1;
			unset($data['variations']);
		}

		$no_state = (bool) $data['pool_mode'];

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
				if ($key == 'parent' && $operation == 'is') {
					$data['no_group'] = 1;
					$no_state = true;
				}
			}
		}
		unset($data['parsed']);

		if (!$no_state && $this->stateful_api) {
			$approved = empty($data['approved']) || !isset($this->approved_filters[$data['approved']]) ?
				$this->default_approved_state : $data['approved'];
			$tagged = empty($data['tagged']) || !isset($this->tagged_filters[$data['tagged']]) ?
				$this->default_tagged_state : $data['tagged'];
			foreach ($this->approved_filters[$approved] as $type => $value) {
				$data['filter'][] = array(
					'name' => 'state',
					'type' => $type,
					'value' => $value
				);
			}
			foreach ($this->tagged_filters[$tagged] as $type => $value) {
				$data['filter'][] = array(
					'name' => 'state',
					'type' => $type,
					'value' => $value
				);
			}
		}
		unset($data['pool_mode']);
		unset($data['pool_value']);
		unset($data['approved']);
		unset($data['tagged']);

		return $data;
	}
}
