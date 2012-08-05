<?php

class Module_Html_Art_Image extends Module_Html_Art_Abstract
{
	protected $js = array('translation');

	public function recieve_data($data) {
		foreach ($data['translation'] as &$translation) {
			$translation['text'] = new Text($translation['text']);
			$translation['text']->html_escape()->format();
		}
		parent::recieve_data($data);
	}
}
