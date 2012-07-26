Overlay = {
	loading: false,
	need_reload: false,

	tpl: function (template, class_name) {
		this.html(this.templates[template], class_name);
		if (this.callback[template]) {
			this.callback[template].call(this);
		}
	},

	ajax: function (url, class_name) {
		this.tpl('loading', null, 240);
		this.loading = url;

		$.get(url, $.proxy(function(data) {
			var overlay = $(".overlay");
			if (this.loading != url && overlay.length) {
				return;
			}

			this.loading = false;
			overlay.find('img').remove();
			overlay.find('.overlay_content').html(data);
			overlay.css('top', '80px');

			if (overlay.height() > $(window).height() - 160) {
				overlay.find('.overlay_content > div').css('height',
					$(window).height() - 160 -
					overlay.find('.overlay_content > h2').height());
				overlay.css('width', $(overlay).width() + 20);
			}

			overlay.css('left', $(window).width()/2 - $(overlay).width()/2);

		}, this));
	},

	html: function (html, class_name, top) {
		class_name = class_name || 'box';
		top = top || 80;

		$(".overlay").remove();

		var div = $('<div/>').addClass('overlay').html(html)
			.addClass('overlay_' + class_name).appendTo('body');

		div.overlay({
			top: top,
			mask: {
				color: '#000',
				loadSpeed: 200,
				opacity: 0.5
			},
			closeOnClick: false,
			load: true,
			onBeforeClose: $.proxy(function() {
				if (this.need_reload) {
					document.location.reload();
				}

				this.loading = false;
			}, this)
		});
	},

	close: function() {
		$(".overlay").overlay().close();
	},

	callback: {
		register: function () {
			init('form', 'register', {
				validate: {
					login: Validate.non_empty,
					password: [Validate.non_empty, {
						fn: Validate.match,
						field: 'password2',
						text: 'Введенные пароли не совпадают'
					}]
				},
				add_data: {
					cookie: $.cookie("sets")
				},
				url: '/api/create/user',
				success: function(response) {
					$.cookie("sets", response.cookie);
					$.cookie("sets", response.cookie, {path: '/',
						domain: '.' + document.location.host});
					document.location.reload();
				}
			});
		},
		login: function() {
			init('form', 'login', {
				validate: {
					login: Validate.non_empty,
					password: Validate.non_empty
				},
				url: '/api/read/user',
				success: function(response) {
					$.cookie("sets", response.cookie);
					$.cookie("sets", response.cookie, {path: '/',
						domain: '.' + document.location.host});
					document.location.reload();
				}
			});
		},
		change_pass: function() {
			init('form', 'change_pass', {
				validate: {
					old_password: Validate.non_empty,
					password: [Validate.non_empty, {
						fn: Validate.match,
						field: 'password2',
						text: 'Введенные пароли не совпадают'
					}]
				},
				add_data: {
					login: User.name
				},
				url: '/api/update/user',
				success: function(response) {
					this.success_overlay('Пароль успешно изменен');
				}
			});
		},
		add_menu: function() {
			init('form', 'add_menu', {
				validate: {
					url: [Validate.non_empty, Validate.url],
					name: Validate.non_empty
				},
				url: '/ajax/menu_add',
				get: true,
				success: function(response) {
					Overlay.close();
					$('#personal_link_dummy').clone()
						.attr('id', 'personal_link_' + response.id)
						.insertBefore('.header_private_item ul .add_menu');
					init('personal_link', response.id, response);
				}
			});
		}
	},

	templates: {
		loading: '<img src="/images/loading_overlay.gif" />' +
			'<span class="overlay_content"></span>'
	}
}

Overlay.templates.register = '<h2>Форма регистрации</h2>' +
'<div><table class="login_input_table" id="form_register">' +
	'<tr>' +
		'<td>' +
			'<span>Логин:</span>' +
		'</td>' +
		'<td>' +
			'<input type="text" name="login" class="login_input" value="">' +
		'</td>' +
	'</tr>' +
	'<tr>' +
		'<td>' +
			'<span>Пароль:</span>' +
		'</td>' +
		'<td>' +
			'<input type="password" name="password" class="login_input" value="">' +
		'</td>' +
	'</tr>' +
	'<tr>' +
		'<td>' +
			'<span>Повторите пароль:</span>' +
		'</td>' +
		'<td>' +
			'<input type="password" name="password2" class="login_input" value="">' +
		'</td>' +
	'</tr>' +
	'<tr>' +
		'<td>' +
			'<span>Е-мейл (не обязательно):</span>' +
		'</td>' +
		'<td>' +
			'<input type="text" name="email" class="login_input" value="">' +
		'</td>' +
	'</tr>' +
	'<tr>' +
		'<td colspan="2">' +
			'<div class="loader" />' +
			'<div class="error" />' +
		'</td>' +
	'</tr>' +
	'<tr>' +
		'<td colspan="2" class="action_holder">' +
			'<input type="submit" value="Зарегистрироваться" ' +
				'class="login_action submit" />' +
		'</td>' +
	'</tr>' +
'</table></div>';

Overlay.templates.login = '<h2>Войти на сайт</h2>' +
'<div><table class="login_input_table" id="form_login">' +
	'<tr>' +
		'<td>' +
			'<span>Логин:</span>' +
		'</td>' +
		'<td>' +
			'<input type="text" name="login" class="login_input" value="">' +
		'</td>' +
	'</tr>' +
	'<tr>' +
		'<td>' +
			'<span>Пароль:</span>' +
		'</td>' +
		'<td>' +
			'<input type="password" name="password" class="login_input" value="">' +
		'</td>' +
	'</tr>' +
	'<tr>' +
		'<td colspan="2">' +
			'<div class="loader" />' +
			'<div class="error" />' +
		'</td>' +
	'</tr>' +
	'<tr>' +
		'<td colspan="2">' +
			'<input type="submit" value="Залогиниться" ' +
				'class="login_action submit" />' +
		'</td>' +
	'</tr>' +
'</table></div>';

Overlay.templates.change_pass = '<h2>Смена пароля</h2>' +
'<div><table class="login_input_table" id="form_change_pass">' +
	'<tr>' +
		'<td>' +
			'<span>Старый пароль:</span>' +
		'</td>' +
		'<td>' +
			'<input type="password" name="old_password" class="login_input" value="">' +
		'</td>' +
	'</tr>' +
	'<tr>' +
		'<td>' +
			'<span>Новый пароль:</span>' +
		'</td>' +
		'<td>' +
			'<input type="password" name="password" class="login_input" value="">' +
		'</td>' +
	'</tr>' +
	'<tr>' +
		'<td>' +
			'<span>Повторите новый пароль:</span>' +
		'</td>' +
		'<td>' +
			'<input type="password" name="password2" class="login_input" value="">' +
		'</td>' +
	'</tr>' +
	'<tr>' +
		'<td colspan="2">' +
			'<div class="loader" />' +
			'<div class="error" />' +
			'<div class="success" />' +
		'</td>' +
	'</tr>' +
	'<tr>' +
		'<td colspan="2">' +
			'<input type="submit" value="Сменить пароль" ' +
				'class="login_action submit" />' +
		'</td>' +
	'</tr>' +
'</table></div>';

Overlay.templates.add_menu = '<h2>Добавить пункт в личное меню.</h2>' +
'<div><table class="table_add_menu" id="form_add_menu">' +
	'<tr>' +
		'<td>' +
			'<span>Название ссылки:</span>' +
		'</td>' +
		'<td>' +
			'<input type="text" class="input" name="name" value="">' +
		'</td>' +
	'</tr>' +
	'<tr>' +
		'<td>' +
			'<span>Адрес ссылки:</span>' +
		'</td>' +
		'<td>' +
			'<input type="text" class="input" name="url" value="">' +
		'</td>' +
	'</tr>' +
	'<tr>' +
		'<td colspan="2">' +
			'<div class="loader" />' +
			'<div class="error" />' +
			'<div class="success" />' +
		'</td>' +
	'</tr>' +
	'<tr>' +
		'<td colspan="2" class="action_holder">' +
			'<input type="submit" class="submit" value="Добавить">' +
		'</td>' +
	'</tr>' +
'</table></div>';
