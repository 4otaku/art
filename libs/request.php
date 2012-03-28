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
		$request = new Request();
		$request->add($this);

		$data = $request->prepare();

		if (empty($data)) {
			return;
		}

		$url = Config::get('api', 'url');

		if (!empty($url)) {

			if (function_exists('igbinary_serialize')) {
				$data['format'] = 'igbinary';
				$data = igbinary_serialize($data);
				$url .= '?f=igbinary';
			} else {
				$data['format'] = 'json';
				$data = json_encode($data);
				$url .= '?f=json';
			}

			$response = Http::post($url, $data);

			if (empty($response)) {
				throw new Error('No response: ' . $url);
			}

			if (function_exists('igbinary_unserialize')) {
				$response = igbinary_unserialize($response);
			} else {
				$response = json_decode($response, true);
			}
		} else {
			$api_request = new Api_Request_Inner($data);
			$worker = new Api_Read_Multi($api_request);
			$response = $worker->process_request()->get_response();
		}

		if (empty($response['success'])) {
			throw new Error('Request failed: ' . $data);
		}

		$request->process_response($response);
	}

	public function process_response($response) {
		foreach ($response as $hash => $data) {
			if (isset($this->requests[$hash])) {
				$this->requests[$hash]->pass_data($data);
				unset($this->requests[$hash]);
			}
		}
	}

	public function prepare() {
		$return = array();
		foreach ($this->requests as $request) {
			$data = $request->get_data();
			$data['api'] = $request->get_api();
			$return[$request->get_hash()] = $data;
		}

		return $return;
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

	public function get_api() {
		return $this->api;
	}

	public function get_data() {
		return $this->data;
	}

	public function get_binded() {
		return $this->binded;
	}

	public function extract_children() {
		$children = $this->requests;
		$this->requests = array();
		return $children;
	}

	public function pass_data($data) {
		foreach ($this->binded as $object) {
			$object->recieve_data($data);
		}
	}
}
