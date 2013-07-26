<?php

class Session
{
	// Домен для куков
	protected $domain = '';

	// Имя куки
	protected $name = 'sets';

	// Хеш куки пользователя
	protected $hash = '';

	// ID куки пользователя
	protected $id = 0;

	// Настройки пользователя
	protected $data = [];
	protected $api_loaded = false;

	protected $moderator = false;

	protected static $instance;

	private function __construct()
	{
		$this->name = Config::get('cookie', 'name', $this->name);

		// Удалим все левые куки, нечего захламлять пространство
		foreach ($_COOKIE as $key => $cook) {
			if ($key != $this->name) {
				setcookie ($key, '', time() - 3600);
			}
		}

		if (Config::get('site', 'domain') != 'localhost') {
			$this->domain = Config::get('site', 'domain');
		}

		// Хэш. Берем либо из cookie, если валиден, либо генерим новый
		if (!empty($_COOKIE[$this->name]) && ctype_xdigit($_COOKIE[$this->name])) {
			$this->hash = $_COOKIE[$this->name];
		} else {
			$this->hash = md5(microtime(true));
		}

		// Пробуем прочитать настройки для хэша
		$sess = Database::get_row('cookie', ['id', 'lastchange'],
			'cookie = ?', $this->hash);

		// Проверяем полученные настройки
		if (!empty($sess)) {
			// Настройки есть
			if (intval($sess['lastchange']) < (time()-3600*24*30)) {
				// Обновляем cookie еще на 2 мес у клиента, если она поставлена больше месяца назад
				$this->update_lifetime();
			}
			$this->id = $this->parse_data($sess['id']);
		} else {
			$this->id = $this->create_session();
		}
	}

	public static function get_instance()
	{
		if (empty(self::$instance)) {
			self::$instance = new Session();
		}

		return self::$instance;
	}

	public static function is_moderator()
	{
		return self::get_instance()->load_api()->moderator;
	}

	protected function update_lifetime()
	{
		$domain = preg_replace('/^[^\.]+/ui', '', $_SERVER['SERVER_NAME']);
		setcookie($this->name, $this->hash, time()+3600*24*60, '/', $domain);
		// Фиксируем факт обновления в БД
		Database::update('cookie', ['lastchange' => time()],
			'cookie = ?', $this->hash);
	}

	protected function parse_data($id)
	{
		$raw = Database::get_table('setting', array('section', 'key', 'value'),
			'id_cookie = ?', $id);

		$data = array();
		foreach ($raw as $item) {
			if (!isset($data[$item['section']])) {
				$data[$item['section']] = array();
			}
			$data[$item['section']][$item['key']] = $item['value'];
		}

		if (empty($data['user'])) {
			$data['user'] = [];
		}

		$this->data = $data;

		return $id;
	}

	public function recieve_data($data)
	{
		$this->data['user']['login'] = empty($data['login']) ?
			'' : (string) $data['login'];
		$this->data['user']['gallery'] = empty($data['gallery']) ?
			false : (int) $data['gallery'];
		$this->data['user']['email'] = empty($data['email']) ?
			'' : (string) $data['email'];

		$this->moderator = empty($data['moderator']) ?
			false : (bool) $data['moderator'];
	}

	protected function create_session()
	{
		// Вносим в БД сессию с дефолтными настройками
		Database::insert('cookie', ['cookie' => $this->hash]);
		$id = Database::last_id();
		$this->update_lifetime();
		return $id;
	}

	public function set($section, $key, $value)
	{
		$this->data[$section][$key] = $value;
		Database::replace('setting', array(
			'id_cookie' => $this->id,
			'section' => $section,
			'key' => $key,
			'value' => $value
		), array('id_cookie', 'section', 'key'));
	}

	public function get_hash()
	{
		return $this->hash;
	}

	public function get_ip()
	{
		return $_SERVER['REMOTE_ADDR'];
	}

	public function get_data()
	{
		$this->load_api();

		$data = $this->data;
		$data['cookie']['hash'] = $this->hash;

		return $data;
	}

	protected function load_api() {
		if (!$this->api_loaded) {
			// Пробуем считаем пользователя из api
			$request = new Request('user', $this, ['cookie' => $this->hash]);
			$request->perform();
			$this->api_loaded = true;
		}
		return $this;
	}

	public function to_json()
	{
		$data = $this->get_data();
		$config = Config::get();
		unset($config['db']);
		unset($config['github']);

		return json_encode(array_replace_recursive($data, $config));
	}
}
