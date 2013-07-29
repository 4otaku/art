// ==UserScript==
// @name       4otaku.org MassTag
// @version    0.1
// @match      http://art.4otaku.org/*
// @copyright  2013+, Nameless
// ==/UserScript==

$(function(){
	var version = 0.1;

	if (!document.location.pathname.match(/^\/*$/)) {
		return;
	}
	if (document.location.search.match(/(\?|&)mode=(?!art(?!ist))/)) {
		return;
	}

	var	sidebar = $('.sidebar:first-child'),
		insert_to = sidebar.children('.sidebar_part:first-child');

	// Создаем объект масстега
	var masstag = $('<div/>').addClass('masstag');
	masstag.hide().insertAfter(sidebar);

	var cancel = $('<div/>').addClass('cancel').click(function(e){
		e.preventDefault();
		hide_masstag();
	});
	masstag.append(cancel);

	var add_field = $('<textarea/>').addClass('field').addClass('autogrow-short');
	var add_tips = $('<div/>').addClass('tips_container')
		.append($('<div/>').addClass('tips'));
	var add_label = $('<span/>').html('Добавить теги: ').addClass('name');
	var add = $('<div/>').append(add_label).append(add_field).append(add_tips)
		.attr('id', 'masstag_tip_add');
	masstag.append(add);

	var del_field = $('<textarea/>').addClass('field').addClass('autogrow-short');
	var del_tips = $('<div/>').addClass('tips_container')
		.append($('<div/>').addClass('tips'));
	var del_label = $('<span/>').html('Удалить теги: ').addClass('name');
	var del = $('<div/>').append(del_label).append(del_field).append(del_tips)
		.attr('id', 'masstag_tip_del');
	masstag.append(del);

	var state_select = $('<select/>').addClass('field');
	var state_label = $('<span/>').html('Одобрение: ').addClass('name');
	$.each({
		'Не изменять': null,
		'Одобрить': 'approved',
		'Отправить на премодерацию': 'unapproved',
		'Отправить в барахолку': 'disapproved'
	}, function(key, value) {
		var option = $('<option/>').val(value).html(key);
		state_select.append(option);
	});
	var state = $('<div/>').append(state_label).append(state_select);
	masstag.append(state);

	var import_select = $('<select/>').addClass('field');
	var import_label = $('<span/>').html('Взять теги с: ').addClass('name');
	$.each({
		' ': null,
		'Danbooru': 'approved',
		'Iqdb': 'iqdb'
	}, function(key, value) {
		var option = $('<option/>').val(value).html(key);
		import_select.append(option);
	});
	var import_wrapper = $('<div/>').append(import_label).append(import_select);
	masstag.append(import_wrapper);

	// добавляем линк в сайдбар
	var link = $('<a/>').html('MassTag 9001').attr('href', '#')
		.click(function(e){
			e.preventDefault();
			show_masstag();
		});
	var wrapper = $('<div/>').addClass('sidebar_row').append(link);
	insert_to.append(wrapper);

	// инициализируем подсказки по тегам
	OBJECT.masstag_tip = function(id, values, events) {
		OBJECT.ajax_tip.call(this, id, values, events);

		this.child.field.css('overflow', 'hidden').autogrow();
	};
	extend(OBJECT.masstag_tip, OBJECT.ajax_tip, {
		class_name: 'masstag_tip',
		address: 'tip_tag',
		max_tip_length: 80,
		minimum_term_length: 1,
		child_config: {
			field: '.field',
			tip: '.tips'
		}
	});
	init('masstag_tip', 'add');
	init('masstag_tip', 'del');

	// функции вызываемые по клику на что-либо
	show_masstag = function() {
		masstag.show();
	};
	hide_masstag = function() {
		masstag.hide();
	};
});
