<?php

// Хороший кандидат в mixin, если будем переходить на PHP 5.4
class Util_Date
{
	public static function format($time, $minutes = false) {
		$time = strtotime($time);
		$rumonth = array(
			'','Январь','Февраль','Март','Апрель',
			'Май','Июнь','Июль','Август',
			'Сентябрь','Октябрь','Ноябрь','Декабрь');
		$date = $rumonth[date('n', $time)].date(' j, Y', $time);
		if ($minutes) {
			$date .= date('; G:i', $time);
		}
		return $date;
	}
}
