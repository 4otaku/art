<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\HtmlAbstract;
use Otaku\Framework\RequestRead;
use Otaku\Framework\Config;
use Otaku\Framework\Text;

class HtmlSidebarComment extends HtmlAbstract
{
	protected $css = ['sidebar'];

	protected function make_request() {
		return new RequestRead('art_list_comment', $this,
			[
				'per_page'=>Config::getInstance()->get('sidebar', 'comments'),
				'add_meta' => true
			]);
	}

	public function recieve_data($data) {
		$data = $data['data'];
		foreach ($data as &$comment){
			$comment['username'] = $comment['comment'][0]['username'];
			$comment['text'] = new Text($comment['comment'][0]['text']);
			$comment['text']->format()->cut_long(100);
		}
		$this->set_param('data', $data);
	}
}
