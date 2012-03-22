<?php

class Request
{
	protected $api = false;
	protected $data = array();
	protected $hash = false;

	protected $binded = array();

	protected $requests = array();

	public function __construct($api = false, $object = false, $data = array()) {
		if ($api && $object && $object instanceOf Module_Abstract) {
			$this->api = (string) $api;
			$this->data = (array) $data;
			$this->hash = md5($this->api . serialize($this->data));

			$this->bind($object);
		}
	}

	public function add($request) {
		if (empty($request) ||!($request instanceOf Request)) {
			return;
		}

		$hash = $request->get_hash();
		$new_requests = $request->extract_children();

		if ($this->get_hash() == $hash) {
			foreach ($request->get_binded() as $object) {
				$this->bind($object);
			}
			unset($request);
		} else {
			if (isset($this->requests[$hash])) {
				foreach ($request->get_binded() as $object) {
					$this->requests[$hash]->bind($object);
				}
				unset($request);
			} else {
				$this->requests[$hash] = $request;
			}
		}

		foreach ($new_requests as $new_request) {
			$this->add($new_request);
		}
	}

	public function perform() {

	}

	public function bind(Module_Abstract $object) {
		foreach ($this->binded as $binded) {
			if ($binded === $object) {
				return;
			}
		}

		$this->binded[] = $object;
	}

	public function get_hash() {
		return $this->hash;
	}

	public function get_binded() {
		return $this->binded;
	}

	public function extract_children() {
		$children = $this->requests;
		$this->requests = array();
		return $children;
	}
}
