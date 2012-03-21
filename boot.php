<?php

include_once 'framework/init.php';

Autoload::init(array(LIBS, EXTERNAL, FRAMEWORK_LIBS, FRAMEWORK_EXTERNAL), CACHE);
mb_internal_encoding('UTF-8');

Config::parse(CONFIG . SL . 'define.ini', true);
Config::parse(CONFIG . SL . 'settings.ini');

$domain = Config::get('site', 'domain');
if ($domain && $domain != $_SERVER['SERVER_NAME']) {
	$url = 'http://'.$domain.$_SERVER['REQUEST_URI'];
	Http::redirect($url, true);
}

$session = Session::get_instance();
Config::add($session->get_data());

$query = new Query($_SERVER['REQUEST_URI'], $_GET);
unset ($_GET, $_POST);

$module = new Module_Main($query);
$request = $module->gather_request();
