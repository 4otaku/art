<?php

namespace Otaku\Art;

use Otaku\Framework\RequestRead;
use Otaku\Framework\Config;

class RequestArtList extends RequestRead
{
	protected $stateful_api = true;
	protected $default_approved_state = 'all';
	protected $default_tagged_state = 'all';

	protected $api_modes = array(
		'comment', 'translation', 'pack', 'group', 'manga',  'artist',
	);

	protected $pool_modes = array(
		'pack', 'group', 'manga',  'artist',
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
		'yes_or_waiting' => array('not' => 'disapproved'),
		'all' => array(),
	);

	protected $tagged_filters = array(
		'yes' => array('is' => 'tagged'),
		'no' => array('is' => 'untagged'),
		'all' => array(),
	);

	public function __construct($object = false, $data = array(), $method = 'recieve_data') {
		if (Config::getInstance()->get('content', 'moderated')) {
			$this->default_approved_state = 'yes';
		}
		if (Config::getInstance()->get('content', 'tagged')) {
			$this->default_tagged_state = 'yes';
		}

		$api = $this->fetch_api($data);
		$data = $this->translate_data($data);

		parent::__construct($api, $object, $data, $method);

		$this->data['add_meta'] = true;
	}

	protected function fetch_api($data) {
		if (!isset($data['mode']) || !in_array($data['mode'], $this->api_modes)) {
			return 'art_list';
		}

		if ($data['mode'] != 'comment' && $data['mode'] != 'translated') {
			$this->stateful_api = false;
		} else {
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
		} elseif (
			!Config::getInstance()->get('content', 'moderated') &&
			(
				!isset($data['mode']) ||
				!in_array($data['mode'], $this->pool_modes)
			)
		) {
			$data['sort_by'] = 'created';
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

		if ($this->stateful_api) {
			if (Config::getInstance()->get('safe', 'mode')) {
				$data['filter'][] = array(
					'name' => 'state',
					'type' => 'is',
					'value' => 'approved'
				);
				$data['filter'][] = array(
					'name' => 'state',
					'type' => 'is',
					'value' => 'tagged'
				);
				$data['filter'][] = array(
					'name' => $this->filter_types['tag'],
					'type' => 'not',
					'value' => 'nsfw'
				);
			} elseif (!$no_state) {
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
		}

		foreach (Config::getInstance()->get('filter') as $value => $type) {
			if ($type == 'remove') {
				$data['filter'][] = array(
					'name' => $this->filter_types['tag'],
					'type' => 'not',
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
