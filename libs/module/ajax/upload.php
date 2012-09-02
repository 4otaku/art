<?php

class Module_Ajax_Upload extends Module_Abstract
{
	protected $data = array();

	protected function make_request()
	{
		$url = Config::get('api', 'url');
//		$url = 'http://api.4otaku.local';

		if (!empty($url)) {

			$url .= '/upload/art';

			$post = [];
			foreach($_FILES['file']['tmp_name'] as $key => $file) {
				$post['file' . $key] = '@' . $file .
					';filename=' . $_FILES['file']['name'][$key] .
					';type=' . $_FILES['file']['type'][$key];
			}

			$header = array('Content-type: multipart/form-data');
			$ch = curl_init($url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($ch, CURLOPT_ENCODING, '');
			curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
			curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
			curl_setopt($ch, CURLOPT_POST, true);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
			$response = curl_exec($ch);
			curl_close($ch);
		} else {
			$api = new Api_Upload_Art(new Api_Request('dummy'));
			$response = $api->set_base_path(API_IMAGES)
				->process_request()->get_response();
		}

		$response = json_decode($response, true);
		foreach ($response['files'] as $item) {
			if (empty($item['error'])) {
				$this->data[] = [
					'name' => $item['name'],
					'size' => $item['weight'],
					'url' => Config::get('api', 'image_url') . $item['image'],
					'thumbnail_url' => Config::get('api', 'image_url') . $item['thumbnail']
				];
			} else {
				$this->data[] = [
					'code' => $item['error_code'],
					'error' => $item['error_text']
				];
			}
		}
	}

	public function format_data() {
		return json_encode($this->data);
	}
}
