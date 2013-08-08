<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Config;
use Otaku\Framework\Text;
use Otaku\Art\TraitTag;

class HtmlArtImage extends HtmlArtAbstract
{
	use TraitTag;

	protected $js = ['external/wysibb', 'wysibb', 'image', 'translation',
		'list'];

	public function recieve_data($data) {
		$data['hidden'] = empty($data['tag']) ? false :
			$this->is_filtered($data['tag'], true);

		$url = Config::getInstance()->get('api', 'image_url');
		$resized = Config::getInstance()->get('api', 'resized');
		$data['src_resized'] = $url . 'art/' . $data['md5'] . '_resize.jpg';
		$data['src_full'] = $url . 'art/' . $data['md5'] . '.' . $data['ext'];
		$data['src'] = ($data['resized'] && $resized) ?
			$data['src_resized'] : $data['src_full'];
		$data['resized'] = (int) ($data['resized'] && $resized);

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
