// ==UserScript==
// @name       4otaku.org MassTag
// @version    0.51
// @match      http://art.4otaku.org/*
// @copyright  2013+, Nameless
// ==/UserScript==

$(function(){
	var version = 0.51;

	if (!document.location.pathname.match(/^\/*$/)) {
		return;
	}
	if (document.location.search.match(/(\?|&)mode=(?!art(?!ist))/)) {
		return;
	}

	var replace_tags = {
		translated: 'translation_request',
		annotated: 'annotation_request',
		commentary: 'commentary_request',
		partially_translated: false
	};

	var delete_tags = ['partially_translated'];

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
	var masstag = $('<div/>', {
		class: 'masstag'
	});
	masstag.hide().insertAfter(sidebar);

	var cancel = $('<div/>', {
		class: 'cancel',
		click: function(e){
			e.preventDefault();
			hide_masstag();
		}
	});
	masstag.append(cancel);

	var add_field = $('<textarea/>', {
		class: 'field autogrow-short',
		change: save_state
	});
	var add_tips = $('<div/>', {
		class: 'tips_container',
		html: '<div class="tips"></div>'
	});
	var add_label = $('<span/>', {
		class: 'name',
		text: 'Добавить теги: '
	});
	var add = $('<div/>')
		.attr('id', 'masstag_tip_add')
		.append(add_label)
		.append(add_field)
		.append(add_tips)
	;
	masstag.append(add);

	var del_field = $('<textarea/>', {
		class: 'field autogrow-short',
		change: save_state
	});
	var del_tips = $('<div/>', {
		class: 'tips_container',
		html: '<div class="tips"></div>'
	});
	var del_label = $('<span/>', {
		class: 'name',
		text: 'Удалить теги: '
	});
	var del = $('<div/>')
		.attr('id', 'masstag_tip_del')
		.append(del_label)
		.append(del_field)
		.append(del_tips)
	;
	masstag.append(del);

	var state_select = $('<select/>', {
		class: 'field',
		change: save_state
	});
	var state_label = $('<span/>').html('Одобрение: ').addClass('name');
	$.each({
		'Не изменять': null,
		'Одобрить': 'approved',
		'Отправить на премодерацию': 'unapproved',
		'Отправить в барахолку': 'disapproved'
	}, function(key, value) {
		var option = $('<option/>', {
			val: value,
			text: key
		});
		state_select.append(option);
	});

	if (is_moderator) {
		var state = $('<div/>')
			.append(state_label)
			.append(state_select)
		;
		masstag.append(state);
	}

	var fetch_select = $('<select/>', {
		class: 'field',
		change: save_state
	});
	var fetch_label = $('<span/>', {
		class: 'name',
		text: 'Взять теги с: '
	});
	$.each({
		' ': null,
		'Danbooru': 'danbooru',
		'Iqdb (нет цветных тегов: автор, произведение, персонаж)': 'iqdb'
	}, function(key, value) {
		fetch_select.append($('<option/>', {
			text: key,
			val: value
		}));
	});
	var fetch = $('<div/>')
		.append(fetch_label)
		.append(fetch_select)
	;
	masstag.append(fetch);

	// добавляем линк в сайдбар
	var link = $('<a/>', {
		text: 'MassTag 9001',
		href: '#',
		click: function(e){
			e.preventDefault();
			show_masstag();
		}
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
	var read_image_callback;
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
		if (fetch === 'iqdb') {
			fetch_worker = iqdb_fetch;
		} else if (fetch === 'danbooru') {
			fetch_worker = danbooru_fetch;
		}
		read_image_callback = function(title){
			if (title) {
				link.attr('title', title);
			}
			image.css('top', '0px');
			image.attr('src', src);
		};
		fetch_worker(function(result){
			if (result) {
				add = apply_fetch_result(add, result);
			}
			state_worker(function(){
				tag_worker(function(){
					read_image(read_image_callback, id);
				}, id, add, del);
			}, id, state);
		}, md5, id);
	};
	var dummy = function(callback) {
		callback.call(this);
	};
	var apply_fetch_result = function(add, result) {
		var res = [];
		$.each(result, function(index, tag) {
			if (delete_tags[tag]) {
				return;
			}

			res.push(replace_tags[tag] ? replace_tags[tag] : tag);
		});

		add = add.concat(res || []);
		add = $.grep(add, function(el, index) {
			return index === $.inArray(el, add);
		});
		return add;
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
	var iqdb_fetch = function (callback, md5) {
		var url = 'https://crossorigin.me/http://www.iqdb.org/?url=http://images.4otaku.org/art/' + md5 + '_thumb.jpg';
		$.get(url, function (data, textStatus) {
			var tags = [],
				html = $(data)
			;
			if (!html.length) {
				Overlay.html('<h2>IQDB не отвечает ('+ textStatus +')</h2>');
			}

			html.filter('#pages').find('table').each(function () {
				var text = $(this).find('tr').last().text();
				if (!text.match(/(9\d%|100) similarity/)) {
					return;
				}
				var img = $(this).find('td.image img');
				var title = img.attr('title');
				if (!title) {
					return;
				}

				// sankaku currently looks broken
				if (img.attr('src').match(/^\/sankaku\//)) {
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
				}
				else {
					data = data[1].split(' ');
				}
				$.each(data, function (key, item) {
					item = item.replace(/^\s+/, '');
					item = item.replace(/\s+$/, '');
					item = item.replace(/\s/, '_');
					tags.push(item);
				});
			});
			callback.call(this, tags);
		});
	};
	var danbooru_fetch = function (callback, md5, id) {
		Ajax.api(
			'slack',
			{user_id: 'MASSTAG', user_name: Config.get('user', 'login'), text: 'пачи теги данбору ' + id},
			function (data) {
				Overlay.html('<h2>'+ (data.text ? data.text : 'Успех!')+'</h2>');

				if (typeof read_image_callback === "function") {
					read_image(read_image_callback, id);
				}
			},
			function (data) {
				Overlay.html('<h2>Danbooru не отвечает</h2>');
			}
		);

		callback.call(this, false);
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
		if (saved && prev_key && prev_key === save_key) {
			show_masstag(saved);
		}
	} catch (e) {}
});
