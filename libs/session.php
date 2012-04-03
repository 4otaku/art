<?php

class Session
{
	// Домен для куков
	protected $domain = '';

	// Имя куки
	protected $name = 'sets';

	// Хеш куки пользователя
	protected $hash = '';

	// Настройки пользователя
	protected $data = array();

	protected $changed = false;

	protected static $instance;

	private function __construct() {
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
		$sess = Database::get_row('settings', array('data', 'lastchange'),
			'cookie = ?', $this->hash);

		// Проверяем полученные настройки
		if (!empty($sess)) {
			// Настройки есть
			if (intval($sess['lastchange']) < (time()-3600*24*30)) {
				// Обновляем cookie еще на 2 мес у клиента, если она поставлена больше месяца назад
				$this->update_lifetime();
			}
			$this->parse_data($sess['data']);
		} else {
			$this->create_session();
		}

		register_shutdown_function(array($this, 'write_changes'));
	}

	public static function get_instance() {
		if (empty(self::$instance)) {
			self::$instance = new Session();
		}

		return self::$instance;
	}

	protected function update_lifetime() {
		setcookie($this->name, $this->hash, time()+3600*24*60, '/', $this->domain);
		// Фиксируем факт обновления в БД
		Database::update('settings', array('lastchange' => time()),
			'cookie = ?', $this->hash);
	}

	protected function parse_data($data) {
		// Проверяем валидность настроек и исправляем, если что-то не так
		$data = base64_decode($data);
		if ($data === false) {
			$this->changed = true;
			return;
		}

		$data = unserialize($data);
		if (!is_array($data)) {
			$this->changed = true;
			return;
		}

		$user = Database::get_row('user', 'login, email, rights',
			'cookie = ?', $this->hash);

		if (!empty($user)) {
			if (empty($data['user'])) {
				$data['user'] = array();
			}
			$data['user'] = array_replace($data['user'], $user);
		}

		$this->data = $data;
	}

	protected function create_session() {
		// Вносим в БД сессию с дефолтными настройками
		Database::insert('settings', array('cookie' => $this->hash));
		$this->update_lifetime();
		$this->changed = true;
	}

	public function write_changes() {
		if (!$this->changed) {
			return;
		}

		Database::update('settings',
			array('data' => base64_encode(serialize($this->data))),
			'cookie = ?', $this->hash);
	}

	public function set($section, $field, $value) {
		$this->data[$section][$field] = $value;
		$this->changed = true;
	}

	public function get_hash() {
		return $this->hash;
	}

	public function get_data() {
		$data = $this->data;
		$data['cookie']['hash'] = $this->hash;

		return $data;
	}
}
