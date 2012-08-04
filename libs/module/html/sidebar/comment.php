<?php

class Module_Html_Sidebar_Comment extends Module_Html_Abstract
{
	protected function make_request() {
		return new Request('art_list_comment', $this,
			array('per_page'=>Config::get('pp', 'latest_comments')));
	}

	public function recieve_data($data) {
		$data = $data['data'];
		foreach ($data as &$comment){
			$comment['comment']['text'] = new Text($comment['comment']['text']);
			$comment['comment']['text']->format()->cut_long_text(100);
		}
		$this->set_param('data', $data);
	}
}
