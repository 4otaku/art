<?php

class Module_Html_Sidebar_Comments extends Module_Html_Abstract
{
	protected function make_request() {
		return new Request('art_list_comment', $this,
			array('per_page'=>Config::get('pp', 'latest_comments')));
	}

	public function recieve_data($data) {
		$data = $data['data'];
		foreach ($data as &$comment){
			$text = new Text($comment['comment']['text']);
			$text->format();
			$text->cut_long_text(100);
			$comment['comment']['text'] = $text->get_text();
		}
		$this->set_param('data', $data);
	}
}
