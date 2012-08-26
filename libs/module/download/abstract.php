<?php

abstract class Module_Download_Abstract extends Module_Abstract
{
	protected $link = false;
	protected $from = 0;
	protected $header = ['status' => 404];
	protected $filename = false;

	protected function get_params(Query $query) {
		$this->id = (int) $query->get('id');
	}

	protected function make_request() {
		if (!$this->id) {
			return parent::make_request();
		}
		return $this->request_item($this->id);
	}

	public function recieve_data($data) {
		$link = $this->get_link($data);

		if (empty($link)) {
			return;
		}

		$api_url = Config::get('api', 'url');
		$prefix = $api_url ?
			'http://' . parse_url($api_url, PHP_URL_HOST) . '/' :
			ROOT_DIR . SL . 'api' . SL;

		$link = $prefix . $link;

		if (!file_exists($link)) {
			return;
		}

		$size = filesize($link);
		$filename = $this->get_filename($link);

		if (isset($_SERVER['HTTP_RANGE'])) {
			list($size_unit, $range_orig) = explode('=', $_SERVER['HTTP_RANGE'], 2);
			if ($size_unit == 'bytes') {
				list($range, $extra_ranges) = explode(',', $range_orig, 2);
			} else {
				$range = '-';
			}
		} else {
			$range = '-';
		}

		list($seek_start, $seek_end) = explode('-', $range, 2);

		$seek_end = empty($seek_end) ? ($size - 1) :
			min(abs(intval($seek_end)), $size - 1);
		$seek_start = (empty($seek_start) || $seek_end < abs(intval($seek_start))) ?
			0 : max(abs(intval($seek_start)), 0);

		if ($seek_start > 0 || $seek_end < ($size - 1)) {
			$this->header['status'] = 206;
		} else {
			$this->header['status'] = 200;
		}

		$this->header['Accept-Ranges'] = 'bytes';
		$this->header['Content-Ranges'] = 'bytes '.$seek_start.'-'.$seek_end.'/'.$size;

		$this->header['Content-Disposition'] = 'attachment; filename="' . $filename . '"';
		$this->header['Content-Length'] = $seek_end - $seek_start + 1;

		$this->link = $link;
		$this->from = $seek_start;
	}

	protected function get_filename($link) {
		if ($this->filename) {
			return str_replace([' ', ';'], '_', $this->filename);
		}

		$fileinfo = pathinfo($link);
		return $fileinfo['basename'];
	}

	public function get_html() {
		if (!$this->link) {
			die;
		}

		$fp = fopen($this->link, 'rb');
		fseek($fp, $this->from);

		while(!feof($fp)) {
			set_time_limit(0);
			print(fread($fp, 1024*1024));
			flush();
			ob_flush();
		}

		fclose($fp);

		die;
	}

	abstract protected function get_link($data);
	abstract protected function request_item($id);
}
