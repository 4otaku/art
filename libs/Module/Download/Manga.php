<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\DownloadAbstract;
use Otaku\Framework\RequestItem;

class DownloadManga extends DownloadAbstract
{
	protected $header = ['Content-type' => 'application/zip'];

	protected function request_item($id) {
		return new RequestItem('art_manga', $this, ['id' => $id]);
	}

	public function recieve_data($data) {
		if (!empty($data['data']['title'])) {
			$this->filename = $data['data']['title'] . '.zip';
		}

		parent::recieve_data($data);
	}

	protected function get_link($data) {
		if (empty($data['data'])) {
			return false;
		}

		return 'files/manga/' . $data['data']['id'] . '.zip';
	}
}
