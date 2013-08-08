<?php

namespace otaku\art;

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
		$params = ['id' => $id];

		if ($this->manga) {
			$params['add_manga'] = 1;
		}

		if ($this->pack) {
			$params['add_packs'] = 1;
		}

		return new Request_Item('art', $this, $params);
	}

	public function recieve_data($data) {
		if (!empty($data['data']['pack'])) {
			foreach ($data['data']['pack'] as $pack) {
				if ($pack['id'] == $this->pack) {
					$this->filename = $pack['filename'];
				}
			}
		}

		if (!empty($data['data']['manga'])) {
			foreach ($data['data']['manga'] as $manga) {
				if ($manga['id'] == $this->manga) {
					$order = $manga['order'] + 1;
					$zero_len = max(0, 5 - strlen($order));
					$this->filename = str_repeat('0', $zero_len) .
						$order . '.' . $data['data']['ext'];
				}
			}
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
