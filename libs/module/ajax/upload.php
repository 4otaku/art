<?php

class Module_Ajax_Upload extends Module_Abstract
{
	const
		LOW_WIDTH = 800,
		LOW_HEIGHT = 600,
		LOW_RES = 'lowres',
		HIGH_WIDTH = 1920,
		HIGH_HEIGHT = 1080,
		HIGH_RES = 'highres',
		WALLPAPER = 'wallpaper';

	protected static $wallpaper_sizes = [
		[1152,864], [1280,960], [1400,1050],
		[2048,1536], [1024,768], [1280,1024],
		[1600,1200], [1024,768], [1280,1024],
		[1600,1200], [1280,800], [1680,1050],
		[1600,1200],
	];

	protected $data = [];

	protected function make_request()
	{
		$url = Config::get('api', 'url');

		if (!empty($url)) {

			$url .= '/upload/art';

			$post = [];
			foreach($_FILES['file']['tmp_name'] as $key => $file) {
				$post['file' . $key] = '@' . $file .
					';filename=' . $_FILES['file']['name'][$key] .
					';type=' . $_FILES['file']['type'][$key];
			}

			$header = ['Content-type: multipart/form-data'];
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
					'thumbnail_url' => Config::get('api', 'image_url') . $item['thumbnail'],
					'id_upload' => $item['id_upload'],
					'tags' => $this->get_size_tags($item['width'], $item['height'])
				];
			} else {
				$this->data[] = [
					'code' => $item['error_code'],
					'error' => $item['error_text']
				];
			}
		}
		sleep(3);
	}

	public function format_data() {
		return json_encode($this->data);
	}

	protected function get_size_tags($width, $height) {
		$return = [];

		if (in_array([$width, $height], self::$wallpaper_sizes)) {
			$return[] = self::WALLPAPER;
		}
		if ($width < self::LOW_WIDTH && $height < self::LOW_HEIGHT) {
			$return[] = self::LOW_RES;
		}
		if ($width >= self::HIGH_WIDTH && $height >= self::HIGH_HEIGHT) {
			$return[] = self::HIGH_RES;
		}

		return $return;
	}
}
