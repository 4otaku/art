<?php

class Module_Download_Art extends Module_Download_Abstract
{
	protected $manga = false;
	protected $pack = false;

	protected function get_params(Query $query) {
		if ($query->get('manga')) {
			$this->manga = (int) $query->get('manga');
		} elseif ($query->get('pack')) {
			$this->pack = (int) $query->get('pack');
		}

		parent::get_params($query);
	}

	protected function request_item($id) {
		$params = array('filter' => array(array(
			'name' => 'id',
			'type' => 'is',
			'value' => $id
		)));

		if ($this->manga) {
			$params['sort_by'] = 'manga';
			$params['sort_value'] = $this->manga;
		}

		if ($this->pack) {
			$params['sort_by'] = 'pack';
			$params['sort_value'] = $this->pack;
		}

		return new Request_Item('art_list', $this, $params);
	}

	public function recieve_data($data) {
		if (!empty($data['data']['filename'])) {
			$this->filename = $data['data']['filename'];
		}

		if (!empty($data['data']['order'])) {
			$order = $data['data']['order'] + 1;
			$zero_len = max(0, 5 - strlen($order));
			$this->filename = str_repeat('0', $zero_len) .
				$order . '.' . $data['data']['ext'];
		}

		parent::recieve_data($data);
	}

	protected function get_link($data) {
		if (empty($data['data'])) {
			return false;
		}

		switch ($data['data']['ext']) {
			case 'png':
				$this->header['Content-Type'] = 'image/png';
				break;
			case 'gif':
				$this->header['Content-Type'] = 'image/gif';
				break;
			default:
				$this->header['Content-Type'] = 'image/jpeg';
		}

		return 'images/art/' . $data['data']['md5'] .
			'.' . $data['data']['ext'];
	}
}
