<?php

class Request
{
	protected $api = false;
	protected $data = array();
	protected $hash = false;

	protected $binded = array();

	protected $requests = array();
	protected $change = array();

	public function __construct($api = false, $object = false, $data = array(), $method = 'recieve_data')
	{
		if ($api) {
			$this->api = (string) $api;
		}

		$this->data = (array) $data;
		$this->data['cookie'] = Session::get_instance()->get_hash();
		$this->data['ip'] = Session::get_instance()->get_ip();

		if ($object && is_callable(array($object, $method))) {
			$this->hash = md5($this->api . serialize($this->data));

			$this->bind(array($object, $method));
		}
	}

	public function add($request)
	{
		if (empty($request) ||!($request instanceOf Request)) {
			return;
		}

		$hash = $request->get_hash();
		$new_requests = $request->extract_children();

		if ($request instanceOf Request_Change) {
			// Change requests can not be bundled and must be performed before all others
			$this->change[] = $request;
		} else {
			if ($this->get_hash() == $hash) {
				foreach ($request->get_binded() as $object) {
					$this->bind($object);
				}
				unset($request);
			} else {
				if (isset($this->requests[$hash])) {
					foreach ($request->get_binded() as $callback) {
						$this->requests[$hash]->bind($callback);
					}
					unset($request);
				} else {
					$this->requests[$hash] = $request;
				}
			}
		}

		foreach ($new_requests as $new_request) {
			$this->add($new_request);
		}
	}

	public function perform()
	{
		// Perform all change requests separately
		foreach ($this->change as $request) {
			$request->do_request($request->get_data());
		}

		// Then bulk-perform all read requests
		$request = new Request('read_multi');
		$request->add($this);

		$data = $request->prepare();

		if (empty($data)) {
			return;
		}

		$request->do_request($data);
	}

	public function do_request($data)
	{
		$url = Config::get('api', 'url');
		$api = $this->get_api();

		if (!Config::get('api', 'inner')) {
			$url .= '/' . str_replace('_', '/', $api);

			if (function_exists('igbinary_serialize')) {
				$data['format'] = 'igbinary';
				$data = igbinary_serialize($data);
				$url .= '?f=igbinary';
			} else {
				$data['format'] = 'json';
				$data = json_encode($data, JSON_NUMERIC_CHECK);
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
			$class = 'Api_' . implode('_',
				array_map('ucfirst', explode('_', $api)));
			$api_request = new Api_Request_Inner($data);
			$worker = new $class($api_request);
			$response = $worker->process_request()->get_response();
		}

		$this->process_response($response);
	}

	protected function process_response($response)
	{
		foreach ($response as $hash => $data) {
			if (isset($this->requests[$hash])) {
				$this->requests[$hash]->pass_data($data);
				unset($this->requests[$hash]);
			}
		}
	}

	public function prepare()
	{
		$return = array();
		foreach ($this->requests as $request) {
			$data = $request->get_data();
			$data['api'] = $request->get_api();
			$return[$request->get_hash()] = $data;
		}

		return $return;
	}

	public function bind($callback)
	{
		foreach ($this->binded as $binded) {
			if ($binded === $callback) {
				return;
			}
		}

		$this->binded[] = $callback;
	}

	public function get_hash()
	{
		return $this->hash;
	}

	public function get_api()
	{
		return $this->api;
	}

	public function get_data()
	{
		return $this->data;
	}

	public function get_binded()
	{
		return $this->binded;
	}

	public function extract_children()
	{
		$children = array_merge(array_values($this->requests),
			array_values($this->change));
		$this->requests = array();
		$this->change = array();
		return $children;
	}

	public function pass_data($data)
	{
		foreach ($this->binded as $callback) {
			$object = $callback[0];
			$method = $callback[1];
			$object->$method($data);
		}
	}
}
