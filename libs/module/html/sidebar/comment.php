<?php

class Module_Html_Sidebar_Comment extends Module_Html_Abstract
{
	protected $css = ['sidebar'];

	protected function make_request() {
		return new Request('art_list_comment', $this,
			[
				'per_page'=>Config::get('pp', 'latest_comments'),
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
