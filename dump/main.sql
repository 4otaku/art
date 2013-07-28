
--
-- Структура таблицы `head_menu_user`
--

CREATE TABLE IF NOT EXISTS `head_menu_user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cookie` varchar(32) NOT NULL,
  `name` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `order` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `selector` (`cookie`,`order`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `help`
--

CREATE TABLE IF NOT EXISTS `help` (
  `key` varchar(16) NOT NULL,
  `text` longtext NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `plugin`
--

CREATE TABLE IF NOT EXISTS `plugin` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `filename` varchar(64) NOT NULL,
  `thread` int(10) unsigned NOT NULL,
  `css` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `js` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `script` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

INSERT INTO `plugin` (`id`, `filename`, `thread`, `css`, `js`, `script`) VALUES
(1, 'collapsible_sidebar', 11971, 1, 1, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `cookie`
--

CREATE TABLE IF NOT EXISTS `cookie` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cookie` varchar(32) NOT NULL,
  `lastchange` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique` (`cookie`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `setting`
--

CREATE TABLE IF NOT EXISTS `setting` (
  `id_cookie` int(10) unsigned NOT NULL,
  `section` varchar(128) NOT NULL,
  `key` varchar(128) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`id_cookie`,`section`,`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;