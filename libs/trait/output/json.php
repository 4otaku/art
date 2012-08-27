<?php

trait Trait_Output_Json
{
	protected function format_data() {
		$data = $this->var;
		$data['success'] = $this->success;

		if (!$data['success']) {
			$data['errors'] = array(array('code' => $this->error_code,
				'message' => $this->error));
		}

		return json_encode($data);
	}
}
