<?php

class Module_Ajax_Upload extends Module_Ajax_Json
{
	const
		LOW_WIDTH = 480,
		LOW_HEIGHT = 640,
		LOW_RES = 'lowres',
		HIGH_WIDTH = 1600,
		HIGH_HEIGHT = 1200,
		HIGH_RES = 'highres',
		ABSURD_WIDTH = 3200,
		ABSURD_HEIGHT = 2400,
		ABSURD_RES = 'absurdres',
		WALLPAPER = 'wallpaper',
		ANIMATED = 'animated',
		ANIMATED_GIF = 'animated_gif',
		ANIMATED_PNG = 'animated_png';

	protected static $wallpaper_sizes = [
		[1152,864], [1280,960], [1400,1050],
		[2048,1536], [1024,768], [1280,1024],
		[1600,1200], [1024,768], [1280,1024],
		[1600,1200], [1280,800], [1680,1050],
		[1600,1200],
	];

	protected $data = [];

	protected $header = [
		'Access-Control-Allow-Origin' => '*',
		'Access-Control-Allow-Headers' =>
			'Origin, X-Requested-With, Content-Type, Accept, X-File-Name'
	];

	protected function make_request()
	{
		$url = Config::get('api', 'url');

		// Hacked because of file send
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
					'upload_key' => $item['upload_key'],
					'tags' => $this->get_auto_tags($item)
				];
			} else {
				$this->data[] = [
					'code' => $item['error_code'],
					'error' => $item['error_text']
				];
			}
		}

		return false;
	}

	public function format_data() {
		return json_encode($this->data);
	}

	protected function get_auto_tags($data) {
		$return = [];

		$width = $data['width'];
		$height = $data['height'];
		if (in_array([$width, $height], self::$wallpaper_sizes)) {
			$return[] = self::WALLPAPER;
		}
		if ($width < self::LOW_WIDTH && $height < self::LOW_HEIGHT) {
			$return[] = self::LOW_RES;
		}
		if ($width >= self::ABSURD_WIDTH && $height >= self::ABSURD_HEIGHT) {
			$return[] = self::ABSURD_RES;
		} elseif ($width >= self::HIGH_WIDTH && $height >= self::HIGH_HEIGHT) {
			$return[] = self::HIGH_RES;
		}

		if ($data['animated']) {
			$return[] = self::ANIMATED;
			if ($data['extension'] == 'gif') {
				$return[] = self::ANIMATED_GIF;
			}
			if ($data['extension'] == 'png') {
				$return[] = self::ANIMATED_PNG;
			}
		}

		return $return;
	}
}
