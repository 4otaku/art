-- --------------------------------------------------------

--
-- Структура таблицы `help`
--

CREATE TABLE IF NOT EXISTS `help` (
  `key` varchar(16) NOT NULL,
  `text` longtext NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;