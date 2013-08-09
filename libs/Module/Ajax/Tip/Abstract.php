<?php

namespace Otaku\Art\Module;

use Otaku\Framework\Module\AjaxJson;
use Otaku\Framework\Query;
use Otaku\Framework\Text;
use Otaku\Framework\RequestRead;
use Otaku\Framework\Config;

abstract class AjaxTipAbstract extends AjaxJson
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
		$class = get_called_class();
		$class = preg_replace('/^.*\\\\Ajax/', '', $class);
		$class = preg_replace('/([a-z])([A-Z])/', '\1_\2', $class);
		return 'art_' . strtolower($class);
	}

	protected function make_request()
	{
		return new RequestRead($this->get_request_name(), $this, array(
			$this->request_type => $this->term,
			'per_page' => Config::getInstance()->get('art', 'tag_tip')
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
