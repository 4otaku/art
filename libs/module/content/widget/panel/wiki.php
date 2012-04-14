<?php

class Module_Content_Widget_Panel_Wiki extends Module_Content_Widget_Panel_Abstract
{
	private $wiki_namespaces = array(
		1 => 'Обсуждение',
		2 => 'Участник',
		3 => 'Обсуждение_участника',
		4 => 'wiki',
		5 => 'Обсуждение_wiki',
		6 => 'Файл',
		7 => 'Обсуждение_файла',
		8 => 'MediaWiki',
		9 => 'Обсуждение_MediaWiki',
		10 => 'Шаблон',
		11 => 'Обсуждение_шаблона',
		12 => 'Справка',
		13 => 'Обсуждение_справки',
		14 => 'Категория',
		15 => 'Обсуждение_категории',
		500 => 'Тег',
		501 => 'Обсуждение_тега',
	);

	protected function make_request() {
		return new Request_Item('recentchanges', $this, array(
			'fields' => array('rc_title', 'rc_namespace'),
			'mode' => 'no_count'));
	}

	public function recieve_data($data) {
		$data = $data['data'];
		if (array_key_exists($data['rc_namespace'], $this->wiki_namespaces)) {
			$name = $this->wiki_namespaces[$data['rc_namespace']].':'.$data['rc_title'];
		} else {
			$name = $data['rc_title'];
		}

		$url = str_replace(array('%3A', '%2F'), array(':', '/'), urlencode($name));

		$this->set_param('name', $name);
		$this->set_param('url', $url);
	}
}
