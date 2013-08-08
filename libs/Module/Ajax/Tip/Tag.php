<?php

namespace Otaku\Art;

class Module_Ajax_Tip_Tag extends Module_Ajax_Tip_Abstract
{
	protected $request_type = 'left';
	protected $request_name_field = 'name';
	protected $request_data_fields = array();

	protected function parse_raw_term()
	{
		return parent::parse_raw_term()->cut_on("\t ");
	}
}
