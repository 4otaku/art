<?php

namespace Otaku\Art;

class RequestArtNextprev extends RequestArtList
{
	protected $pos = false;

	public function __construct($pos, $object = false, $data = array(),
	                            $method = 'recieve_data') {
		unset($data['page']);
		$this->pos = $pos;

		if ($pos > 1) {
			$data['offset'] = $pos - 2;
			$data['per_page'] = 3;
		} else {
			$data['offset'] = 0;
			$data['per_page'] = 2;
		}
		parent::__construct($object, $data, $method);

		$this->data['add_meta'] = false;
	}

	public function pass_data($data) {
		$return = array();
		if ($this->pos > 1) {
			$return['prev'] = array_shift($data['data']);
			if ($return['prev']) {
				$return['prev']['pos'] = $this->pos - 1;
			}
		}

		$return['current'] = array_shift($data['data']);
		$return['next'] = array_shift($data['data']);
		if ($return['next']) {
			$return['next']['pos'] = $this->pos + 1;
		}

		parent::pass_data($return);
	}
}
