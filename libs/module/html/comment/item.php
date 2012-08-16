<?php

class Module_Html_Comment_Item extends Module_Html_Abstract
{
	protected $css = array('comment');
	protected $js = array('comment');

	public function recieve_data($data) {
		$data['date'] = Util_Date::format($data['sortdate'], true);
		if (!empty($data['editdate'])) {
			$data['editdate'] = Util_Date::format($data['editdate'], true);
		}

		$data['text'] = new Text($data['text']);
		$data['text']->format();

		$data['uid'] = md5(rand());

		parent::recieve_data($data);
	}
}



