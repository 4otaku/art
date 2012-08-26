<?php

trait Trait_File
{
	protected function format_weight($size) {
		$type = 0;
		while ($size > 1024 && $type < 3) {
			$type++;
			$size = $size / 1024;
		}

		$size = round($size, 1);
		return $size . ' ' . $this->size_types[$type];
	}
}
