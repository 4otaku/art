<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\HtmlAbstract;
use Otaku\Framework\Config;
use Otaku\Art\TraitTag;

abstract class HtmlThumbnailAbstract extends HtmlAbstract
{
	use TraitTag;

	protected $css = array('thumb');

	public function recieve_data($data) {
		$data['tip'] = $this->make_tooltip($data);
		$data['hidden'] = $this->is_filtered($data['tag']);

		$large = (Config::getInstance()->get('art', 'largethumbs') ? 'large' : '');
		if (!empty($data['md5'])) {
			$data['src'] = Config::getInstance()->get('api', 'image_url') . 'art/' .
				$data['md5'] . '_' . $large . 'thumb.jpg';
		} else {
			$data['src'] = '/images/empty_' . $large . 'pool.jpg';
		}

		parent::recieve_data($data);
	}

	abstract protected function make_tooltip($data);
}
