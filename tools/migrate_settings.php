#!/usr/bin/php
<?php

if (PHP_SAPI != 'cli') {
	die;
}
include dirname(__DIR__) . '/framework/init.php';

define('API', ROOT_DIR . SL . 'api' . SL);
define('API_LIBS', API . 'libs' . SL);
define('API_IMAGES', API . 'images' . SL);

Autoload::init(array(LIBS, EXTERNAL, API_LIBS,
	FRAMEWORK_LIBS, FRAMEWORK_EXTERNAL), CACHE);

mb_internal_encoding('UTF-8');

Config::parse(CONFIG . SL . 'define.ini', true);

$settings = Database::get_full_table('settings');
foreach ($settings as $setting) {
	Database::insert('cookie', array(
		'cookie' => $setting['cookie'],
		'lastchange' => $setting['lastchange'],
	));
	$id_cookie = Database::last_id();

	$data = unserialize(base64_decode($setting['data']));
	foreach ($data as $section => $values) {
		foreach ($values as $key => $value) {
			Database::insert('setting', array(
				'id_cookie' => $id_cookie,
				'section' => $section,
				'key' => $key,
				'value' => $value,
			));
		}
	}
}