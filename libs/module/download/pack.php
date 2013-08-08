<?php

namespace otaku\art;

class Module_Download_Pack extends Module_Download_Abstract
{
	protected $header = ['Content-type' => 'application/zip'];

	protected function request_item($id) {
		return new Request_Item('art_pack', $this, ['id' => $id]);
	}

	public function recieve_data($data) {
		if (!empty($data['data']['title'])) {
			$this->filename = $data['data']['title'] . '.zip';
		}

		parent::recieve_data($data);
	}

	protected function get_link($data) {
		if (empty($data['data']['id'])) {
			return false;
		}

		return 'files/pack/' . $data['data']['id'] . '.zip';
	}
}
