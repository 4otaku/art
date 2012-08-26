<?php

class Module_Download_Manga extends Module_Download_Abstract
{
	protected $header = ['Content-type' => 'application/zip'];

	protected function request_item($id) {
		return new Request_Item('art_manga', $this, ['id' => $id]);
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
