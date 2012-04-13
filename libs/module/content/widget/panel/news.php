<?php

class Module_Content_Widget_Panel_News extends Module_Content_Widget_Panel_Abstract
{
	protected function make_request() {
		return new Request_Single('news', $this, array(
			'area' => 'main',
			'fields' => array('title', 'comment_count')
		));
	}
}
