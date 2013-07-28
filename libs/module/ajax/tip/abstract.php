<?php

abstract class Module_Ajax_Tip_Abstract extends Module_Ajax_Json
{
	protected $raw_term = false;
	protected $term = false;
	protected $request_type = 'text';
	protected $request_name_field = 'title';
	protected $request_data_fields = array('id');

	protected function get_params(Query $query)
	{
		$this->raw_term = $query->get('term');
		$this->term = (string) $this->parse_raw_term();
	}

	protected function parse_raw_term()
	{
		$term = new Text($this->raw_term);
		return $term->lower()->trim()->cut_on("\n\r");
	}

	protected function get_request_name()
	{
		$class = strtolower(get_called_class());
		$class = str_replace('module_ajax_', '', $class);
		return 'art_' . $class;
	}

	protected function make_request()
	{
		return new Request($this->get_request_name(), $this, array(
			$this->request_type => $this->term,
			'per_page' => Config::get('art', 'tag_tip')
		));
	}

	public function recieve_data($data)
	{
		$return = [];
		foreach ($data['data'] as $item) {
			$add = ['name' => $item[$this->request_name_field]];
			foreach ($this->request_data_fields as $field) {
				$add[$field] = $item[$field];
			}
			$return[] = $add;
		}

		$this->set_success(true);
		$this->set_params([
			'data' => $return,
			'query' => $this->raw_term
		]);
	}
}
