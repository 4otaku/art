<?php

abstract class Module_Html_Art_Abstract extends Module_Html_Abstract
{
	protected $query;
	protected $size_types = array('б', 'кб', 'мб', 'гб');

	public function __construct(Query $query) {
		if (!($query instanceOf Query_Art)) {
			$query = new Query_Art($query);
		}
		parent::__construct($query);

		$this->query = $query;
	}

	protected function get_common_request() {
		$params = $this->query->other();
		$params['parsed'] = $this->query->parsed();
		$params['pool_mode'] = $this->query->get_pool_mode();
		$params['pool_value'] = $this->query->get_pool_value();
		return new Request_Art_List($this, $params);
	}

	protected function format_weight($size) {
		$type = 0;
		while ($size > 1024 && $type < 3) {
			$type++;
			$size = $size / 1024;
		}

		$size = round($size, 1);
		return $size . ' ' . $this->size_types[$type];
	}

	protected function format_time($time, $minutes = false) {
		$rumonth = array(
			'','Январь','Февраль','Март','Апрель',
			'Май','Июнь','Июль','Август',
			'Сентябрь','Октябрь','Ноябрь','Декабрь');
		$date = $rumonth[date('n', strtotime($time))].date(' j, Y');
		if ($minutes) {
			$date .= date('; G:i');
		}
		return $date;
	}
}
