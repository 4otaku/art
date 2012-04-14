<?php

class Module_Content_Widget_Panel_Board extends Module_Content_Widget_Panel_Abstract
{
	protected function make_request() {
		$request = new Request_Count('board', $this, array(
			'type' => 'thread'
		));

//		$lastvisit = Config::get('visit', 'board');
$lastvisit = 1328936546570;

		if ($lastvisit) {
			$request->add(new Request_Count('board', $this, array(
				'type' => 'thread',
				'sortdate' => array('>', $lastvisit)
			), 'recieve_new'));

			$request->add(new Request_Count('board', $this, array(
				'type' => 'thread',
				'sortdate' => array('<=', $lastvisit),
				'updated' => array('>', $lastvisit),
			), 'recieve_updated'));
		}

		$this->set_param('link', urlencode(date('Y-m-d_H:i:s', $lastvisit)));

		return $request;
	}

	public function recieve_new($data) {
		$this->set_param('new', $data['count']);
	}

	public function recieve_updated($data) {
		$this->set_param('updated', $data['count']);
	}
}
