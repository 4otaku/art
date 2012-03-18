<?php

include_once 'framework/init.php';

Autoload::init(array(LIBS, FRAMEWORK), CACHE);
mb_internal_encoding('UTF-8');

if(def::site('domain') != $_SERVER['SERVER_NAME'] && !empty($_SERVER['REMOTE_ADDR'])) {
	engine::redirect('http://'.$def['site']['domain'].$_SERVER['REQUEST_URI'], true);
}

if (_TYPE_ != 'cron' && _TYPE_ != 'api') {
	$check = new check_values();
	include_once ROOT_DIR.SL.'engine'.SL.'twig_init.php';
}
if (_TYPE_ != 'cron') {
	list($get, $post) = query::get_globals($_GET, $_POST);
}
include_once ROOT_DIR.SL.'engine'.SL.'metafunctions.php';

// Тут мы работаем с сессиями
if (_TYPE_ != 'cron' && _TYPE_ != 'api') {
	// Логично, что у крона или апи сессии нет.

	// Удалим все левые куки, нечего захламлять пространство
	foreach ($_COOKIE as $key => $cook) if ($key != 'settings') setcookie ($key, "", time() - 3600);

	$cookie_domain = (def::site('domain') != 'localhost' ? def::site('domain') : '').SITE_DIR;

	// Хэш. Берем либо из cookie, если валиден, либо генерим новый
	query::$cookie = (!empty($_COOKIE['settings']) && $check->hash($_COOKIE['settings'])) ? $_COOKIE['settings'] : md5(microtime(true));

	// Пробуем прочитать настройки для хэша
	$sess = Database::get_row('settings',
		array('data', 'lastchange'),
		'cookie = ?',
		query::$cookie);

        // Проверяем полученные настройки
	if (isset($sess['data']) && isset($sess['lastchange'])) {
		// Настройки есть

		// Обновляем cookie еще на 2 мес у клиента, если она поставлена больше месяца назад
		if(intval($sess['lastchange']) < (time()-3600*24*30)) {
			setcookie('settings', query::$cookie, time()+3600*24*60, '/', $cookie_domain);
			// Фиксируем факт обновления в БД
			Database::update('settings',
				array('lastchange' => time()),
				'cookie = ?',
				query::$cookie);
		}

		// Проверяем валидность настроек и исправляем, если что-то не так
		if ((base64_decode($sess['data']) !== false) && is_array(unserialize(base64_decode($sess['data'])))) {
			// Все ок, применяем сохраненные настройки
			$sets = array_replace_recursive($sets,
				unserialize(base64_decode($sess['data'])));

			$user = Database::get_row('user', 'login, email, rights',
				'cookie = ?', query::$cookie);

			if (!empty($user)) {
				$sets['user'] = array_replace($sets['user'], $user);
			}

			sets::import($sets);
		} else {
			// Заполняем поле настройками 'по-умолчанию' (YTowOnt9 разворачивается в пустой массив)
			Database::update('settings',
				array('data' => 'YTowOnt9'),
				'cookie = ?',
				query::$cookie);
		}
	} else {
		// Настроек нет, создаем их

		setcookie('settings', query::$cookie, time()+3600*24*60, '/' , $cookie_domain);
		// Вносим в БД сессию с дефолтными настройками
		Database::insert('settings', array(
			'cookie' => query::$cookie,
			'data' => 'YTowOnt9',
			'lastchange' => time()
		));
	}
}

$request = preg_replace('/^'.preg_quote(SITE_DIR,'/').'/', '', $_SERVER["REQUEST_URI"]);
$request = urldecode($request);
$request = preg_replace('/\/tag\/([^\/\p{Cyrillic}\p{Hiragana}\p{Katakana}]*)/eui', '"/tag/".urlencode("$1")', $request);
$request = str_replace('%5C%27', '%27', $request);

$url = explode('/', preg_replace('/\?[^\/]+$/', '', $request));

if (isset($url[0])) {
	unset($url[0]);
}
if (empty($url[1])) {
	$url[1] = 'index';
}

if (preg_match('/[^a-z\d_\_]/ui', $url[1])) {
	include_once TEMPLATE_DIR.SL.'404'.SL.'fatal.php';
	ob_end_flush();
	exit();
}

query::$url = $url;

include_once ROOT_DIR.SL.'engine'.SL.'handle_old_urls.php';

if ($url[1] == 'confirm' || $url[1] == 'stop_emails') {
	if ($url[1] == 'confirm') {
		input__comment::subscribe_comments(
			decrypt($url[2]),
			$url[3],
			$url[5] ? $url[4].'|'.$url[5] : null,
			$url[5] ? null: $url[4]
		);
	} else {
		input__comment::add_to_black_list(decrypt($url[2]));
	}
	$redirect = 'http://'.def::site('domain').'/'.(empty($url[3]) ? 'news/' : $url[3].'/'.$url[4].'/'.$url[5]);
	engine::redirect($redirect);
}

if (isset(query::$post['do'])) {
	query::$post['do'] = explode('.', query::$post['do']);
	if (count(query::$post['do']) == 2) {
		$input_class = 'input__'.query::$post['do'][0];
		$input = new $input_class;
		$input_function = query::$post['do'][1];
		$input->$input_function(query::$post);
	}
	$redirect = 'http://'.def::site('domain').(empty($input->redirect) ? $_SERVER["REQUEST_URI"] : $input->redirect);
	engine::redirect($redirect);
} elseif (isset(query::$post['action']) &&
	in_array(query::$post['action'], array('Create', 'Update', 'Delete'))) {

	$class = query::$post['action'] . '_' . ucfirst($url[1]);

	if (class_exists($class)) {

		$worker = new $class();

		$function = empty(query::$post['function']) ?
			'main' : query::$post['function'];

		if ($worker->check_access($function)) {

			$worker->$function();
			$worker->process_result();
		}
	}
} else {

	$class = 'Read_' . implode('_', array_map('ucfirst', explode('_', $url[1])));

	if (class_exists($class)) {

		$worker = new $class();
		$process_url = array_values(query::$url);

		$worker->process($process_url);
	} else {

		$data = array();

		$output_class = 'output__'.$url[1];
		$output = new $output_class;

		$output->check_404($output->allowed_url);
		if (!$error) {
			$data['main'] = $output->get_data();
		}

		$data = array_merge($data, $output->get_side_data($output->side_modules));
		if ($error) {
			$output->make_404($output->error_template);
		}

		include_once TEMPLATE_DIR.SL.str_replace('__',SL,$output->template).'.php';
	}

	ob_end_flush();
}
