<?php

class Module_Content_Widget_Panel_Gouf extends Module_Content_Widget_Panel_Abstract
{
	protected function make_request() {
		return new Request_Count('post_url', $this, array('status' => 3));
	}
}
