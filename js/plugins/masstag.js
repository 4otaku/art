// ==UserScript==
// @name       4otaku.org MassTag
// @version    0.4
// @match      http://art.4otaku.org/*
// @copyright  2013+, Nameless
// ==/UserScript==

$(function(){
	var version = 0.4;

	if (!document.location.pathname.match(/^\/*$/)) {
		return;
	}
	if (document.location.search.match(/(\?|&)mode=(?!art(?!ist))/)) {
		return;
	}

	var	sidebar = $('.sidebar').first(),
		insert_to = sidebar.find('.sidebar_part').first(),
		images = $('.image_thumbnail a'),
		is_moderator = Config.get('user', 'moderator') > 0,
		save_key = JSON.stringify(
			location.search.substring(1).replace(/(^|&)page=\d+/, '')
				.replace(/\[\]=/g, '=').split('&').sort()
		);

	var save_state = function() {
		localStorage.setItem('masstag', JSON.stringify({
			add: add_object.get_terms(),
			del: del_object.get_terms(),
			state: is_moderator ? state_select.val() : false,
			fetch: fetch_select.val()
		}));
		localStorage.setItem('masstag_key', save_key);
	};

	// Создаем объект масстега
	var masstag = $('<div/>').addClass('masstag');
	masstag.hide().insertAfter(sidebar);

	var cancel = $('<div/>').addClass('cancel').click(function(e){
		e.preventDefault();
		hide_masstag();
	});
	masstag.append(cancel);

	var add_field = $('<textarea/>').addClass('field').addClass('autogrow-short')
		.change(save_state);
	var add_tips = $('<div/>').addClass('tips_container')
		.append($('<div/>').addClass('tips'));
	var add_label = $('<span/>').html('Добавить теги: ').addClass('name');
	var add = $('<div/>').append(add_label).append(add_field).append(add_tips)
		.attr('id', 'masstag_tip_add');
	masstag.append(add);

	var del_field = $('<textarea/>').addClass('field').addClass('autogrow-short')
		.change(save_state);
	var del_tips = $('<div/>').addClass('tips_container')
		.append($('<div/>').addClass('tips'));
	var del_label = $('<span/>').html('Удалить теги: ').addClass('name');
	var del = $('<div/>').append(del_label).append(del_field).append(del_tips)
		.attr('id', 'masstag_tip_del');
	masstag.append(del);

	var state_select = $('<select/>').addClass('field').change(save_state);
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

	var fetch_select = $('<select/>').addClass('field').change(save_state);
	var fetch_label = $('<span/>').html('Взять теги с: ').addClass('name');
	$.each({
		' ': null,
		'Danbooru': 'danbooru',
		'Iqdb': 'iqdb'
	}, function(key, value) {
		var option = $('<option/>').val(value).html(key);
		fetch_select.append(option);
	});
	var fetch = $('<div/>').append(fetch_label).append(fetch_select);
	masstag.append(fetch);

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
	var show_masstag = function(saved) {
		masstag.show();
		images.on('click.masstag', process);

		if (saved) {
			add_field.val(saved.add.join(' '));
			del_field.val(saved.del.join(' '));
			state_select.val(saved.state);
			fetch_select.val(saved.fetch);
		}
	};
	var hide_masstag = function() {
		masstag.hide();
		images.off('click.masstag');
		localStorage.removeItem('masstag');
	};
	var process = function(e) {
		e.preventDefault();

		var link = $(this);
		var image = link.children('img');
		var src = image.attr('src');
		var height = image.height();
		var md5 = src.match(/[\da-f]{32}/i)[0];

		image.attr('src', '/images/ajax-loader.gif');
		image.css('position', 'relative');
		image.css('top', Math.max(0, Math.ceil(height/2 - 31)) + 'px');

		var id = this.pathname.replace(/[^\d]/g, '');
		var add = add_object.get_terms();
		var del = del_object.get_terms();
		var state = is_moderator ? state_select.val() : false;
		var fetch = fetch_select.val();

		var tag_worker = add.length || del.length || fetch ?
			process_tag : dummy;
		var state_worker = state ? process_state : dummy;
		var fetch_worker = dummy;
		if (fetch == 'iqdb') {
			fetch_worker = iqdb_fetch;
		} else if (fetch == 'danbooru') {
			fetch_worker = danbooru_fetch;
		}

		fetch_worker(function(result){
			add = add.concat(result || []);
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
	var dummy = function(callback) {
		callback.call(this);
	};
	var process_tag = function(callback, id, add, del) {
		Ajax.api('update_art_tag', {id: id, add: add, remove: del}, function(){
			callback.call(this);
		}, function(){
			callback.call(this);
		});
	};
	var process_state = function(callback, id, state) {
		Ajax.api('update_art_approve', {
			id: id, state: 'state_' + state, cookie: Config.get('cookie', 'hash')
		}, function(){
			callback.call(this);
		}, function(){
			callback.call(this);
		});
	};
	var iqdb_fetch = function(callback, md5) {
		var url = 'http://www.iqdb.org/?url=http://images.4otaku.org/art/' +
			md5 + '_thumb.jpg';
		$.get(url, function(data){
			var tags = [];
			var html = $(data.responseText);
			if (!html.length) {
				Overlay.html('<h2>IQDB не отвечает</h2>');
			}

			html.filter('#pages').find('table').each(function(){
				var text = $(this).find('tr').last().html();
				if (!text.match(/(9\d%|100) similarity/)) {
					return;
				}
				var title = $(this).find('td.image img').attr('title');
				if (!title) {
					return;
				}

				if (title.match(/Rating:\s+e/)) {
					tags.push('nsfw');
				}

				var data = title.match(/Tags:\s+(.*$)/);
				if (!data) {
					return;
				}
				if (data[1].match(/,/)) {
					data = data[1].split(',');
				} else {
					data = data[1].split(' ');
				}
				$.each(data, function(key, item) {
					item = item.replace(/^\s+/, '');
					item = item.replace(/\s+$/, '');
					item = item.replace(/\s/, '_');
					tags.push(item);
				});
			});
			callback.call(this, tags);
		});
	};
	var danbooru_fetch = function(callback, md5) {
		var url = 'http://danbooru.donmai.us/posts.json?tags=md5:'+md5+'&limit=1';
		$.get(url, function(data){
			var tags = [];

			var html = $(data.responseText);
			if (!html.length) {
				Overlay.html('<h2>Danbooru не отвечает</h2>');
			} else {
				var info = JSON.parse(html.filter('p').html());
				if (info.length) {
					tags = info[0].tag_string.split(' ');
				}
			}

			callback.call(this, tags);
		});
	};
	var read_image = function(callback, id) {
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
	};

	// Воспроизводим состояние масстега
	try {
		var saved = JSON.parse(localStorage.getItem('masstag'));
		var prev_key = localStorage.getItem('masstag_key');
		if (saved && prev_key && prev_key == save_key) {
			show_masstag(saved);
		}
	} catch (e) {}
});
