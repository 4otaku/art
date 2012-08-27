<?php

class Module_Ajax_Search_Tip extends Module_Ajax_Json
{
	protected $raw_term = false;
	protected $term = false;

	protected function get_params(Query $query)
	{
		$this->raw_term = $query->get('term');
		$term = new Text($this->raw_term);
		$this->term = (string) $term->lower()->trim()->cut_on("\n\r\t ");
	}

	protected function make_request() {
		if (empty($this->term)) {
			$this->error_code = 420;
			return false;
		}

		return new Request('art_tag_tip', $this, array(
			'left' => $this->term,
			'per_page' => Config::get('pp', 'tip')
		));
	}

	public function recieve_data($data) {
		$tags = array();
		foreach ($data['data'] as $tag) {
			$tags[] = $tag['name'];
		}

		$this->success = true;
		$this->set_params([
			'tags' => $tags,
			'query' => $this->raw_term
		]);
	}
}
