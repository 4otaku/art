<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Config;
use Otaku\Framework\Query;
use Otaku\Framework\Text;
use Otaku\Art\TraitTag;

class HtmlArtImage extends HtmlArtAbstract
{
	use TraitTag;

	protected $js = ['external/wysibb', 'wysibb', 'image', 'translation',
		'list'];
	protected $css = ['thumb', 'similar_ext'];

	protected function get_params(Query $query) {
		$this->set_param('query', $query->to_url_string());
	}

	public function recieve_data($data) {
		$data['hidden'] = empty($data['tag']) ? false :
			$this->is_filtered($data['tag'], true);

		$url = Config::getInstance()->get('api', 'image_url');
		$resized = Config::getInstance()->get('art', 'resized');

		$data['src_resized'] = $url . 'art/' . $data['md5'] . '_resize.' . ('gif' === $data['ext'] ? 'gif' : 'jpg');
		$data['src_full'] = $url . 'art/' . $data['md5'] . '.' . $data['ext'];
		$data['src'] = ($data['resized'] && $resized) ?
			$data['src_resized'] : $data['src_full'];
		$data['resized'] = (int) ($data['resized'] && $resized);

		if (!empty($data['similar_ext']) && count($data['similar_ext']) > 1) {
			foreach ($data['similar_ext'] as $k => $item) {
				$data['similar_ext'][$k]['src_thumb'] = $url . 'art/' . $item['md5'] . '_thumb.jpg';
			}
		}
		else {
			$data['similar_ext'] = [];
		}

		foreach ($data['translation'] as &$translation) {
			$translation['id'] = $translation['id_translation'];
			$translation['id_art'] = $data['id'];
			$translation['text'] = new Text($translation['text']);
			$translation['text']->html_escape();
			$length = strlen((string) $translation['text']);
			$translation['width'] = max(100, min(350, $length * 2));
		}
		parent::recieve_data($data);
	}
}
