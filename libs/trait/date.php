<?php

trait Trait_Date
{
	protected $rumonth = [
		'Январь', 'Февраль', 'Март', 'Апрель',
		'Май', 'Июнь', 'Июль', 'Август',
		'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
	];

	protected function format_date($time) {
		$time = strtotime($time);
		$date = $this->rumonth[date('n', $time) - 1] .
			date(' j, Y', $time);
		return $date;
	}

	protected function format_time($time) {
		$date = $this->format_date($time);
		$time = strtotime($time);
		return $date . date('; G:i', $time);
	}
}
