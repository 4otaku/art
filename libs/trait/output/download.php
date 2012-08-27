<?php

trait Trait_Output_Download
{
	protected function format_data() {
		if ($this->link) {
			$fp = fopen($this->link, 'rb');
			fseek($fp, $this->from);

			while(!feof($fp)) {
				set_time_limit(0);
				print(fread($fp, 1024*1024));
				flush();
				ob_flush();
			}

			fclose($fp);
		}
	}
}
