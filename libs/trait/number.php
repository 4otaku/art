<?php

trait Trait_Number
{
	protected function wcase($count, $form1, $form2, $form3) {
		if ($count > 9) {
			if ($count % 10 == 0 || $count % 10 > 4 || $count[strlen($count)-2] == 1) return $form3;
			if ($count % 10 == 1) return $form1;
			return $form2;
		}
		if ($count == 0 || $count > 4) return $form3;
		if ($count == 1) return $form1;
		return $form2;
	}
}
