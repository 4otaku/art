// ==UserScript==
// @name       4otaku.org MassTag
// @version    0.3
// @match      http://art.4otaku.org/*
// @copyright  2013+, Nameless
// ==/UserScript==

$(function(){
	var version = 0.2;

	if (!document.location.pathname.match(/^\/*$/)) {
		return;
	}
	if (document.location.search.match(/(\?|&)mode=(?!art(?!ist))/)) {
		return;
	}

	var	sidebar = $('.sidebar:first-child'),
		insert_to = sidebar.children('.sidebar_part:first-child'),
		images = $('.image_thumbnail a'),
		is_moderator = Config.get('user', 'moderator') > 0;

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
	if (is_moderator) {
		masstag.append(state);
	}

	var fetch_select = $('<select/>').addClass('field');
	var fetch_label = $('<span/>').html('Взять теги с: ').addClass('name');
	$.each({
		' ': null,
		'Danbooru': 'approved',
		'Iqdb': 'iqdb'
	}, function(key, value) {
		var option = $('<option/>').val(value).html(key);
		fetch_select.append(option);
	});
	var fetch = $('<div/>').append(fetch_label).append(fetch_select);
	//masstag.append(fetch);

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
	var add_object = init('masstag_tip', 'add');
	var del_object = init('masstag_tip', 'del');

	// функции вызываемые по клику на что-либо
	show_masstag = function() {
		masstag.show();
		images.on('click.masstag', process);
	};
	hide_masstag = function() {
		masstag.hide();
		images.off('click.masstag');
	};
	process = function(e) {
		e.preventDefault();

		var link = $(this);
		var image = link.children('img');
		var src = image.attr('src');
		var height = image.height();
		var md5 = src.match(/[\da-f]{32}/i)[1];
		image.attr('src', '/images/ajax-loader.gif');
		image.css('position', 'relative');
		image.css('top', Math.max(0, Math.ceil(height/2 - 31)) + 'px');

		var id = this.pathname.replace(/[^\d]/g, '');
		var add = add_object.get_terms();
		var del = del_object.get_terms();
		var state = is_moderator ? state_select.val() : false;
		var fetch = fetch_select.val();

		var tag_worker = add.length || del.length ? process_tag : dummy;
		var state_worker = state ? process_state : dummy;
		var fetch_worker = fetch ? process_fetch : dummy;

		fetch_worker(function(result){
			add.concat(result || []);
			add = $.grep(add, function(el, index) {
				return index == $.inArray(el, add);
			});
			state_worker(function(){
				tag_worker(function(){
					read_image(function(title){
						if (title) {
							link.attr('title', title);
						}
						image.css('top', '0px');
						image.attr('src', src);
					}, id);
				}, id, add, del);
			}, id, state);
		}, md5, fetch);
	};
	dummy = function(callback, id, param) {
		callback.call(this);
	};
	process_tag = function(callback, id, add, del) {
		Ajax.api('update_art_tag', {id: id, add: add, remove: del}, function(){
			callback.call(this);
		}, function(){
			callback.call(this);
		});
	};
	process_state = function(callback, id, state) {
		Ajax.api('update_art_approve', {
			id: id, state: 'state_' + state, cookie: Config.get('cookie', 'hash')
		}, function(){
			callback.call(this);
		}, function(){
			callback.call(this);
		});
	};
	process_fetch = function(callback, md5, fetch) {
		callback.call(this, []);
	};
	read_image = function(callback, id) {
		Ajax.api('read_art', {id: id, add_tags: 1}, function(data){
			data = data.data[0];
			var title = [];
			title.push('Рейтинг: ' + data.rating);
			title.push('Опубликовал: ' + data.user);
			var tags = [];
			$.each(data.tag, function(key, tag){
				tags.push(tag.name);
			});
			title.push('Теги: ' + tags.join(', '));
			callback.call(this, title.join(' | '));
		}, function(){
			callback.call(this, false);
		});
	}
});
