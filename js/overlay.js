Overlay = {
	loading: false,
	need_reload: false,

	tpl: function (template, class_name) {
		this.html(this.templates[template], class_name);
	},

	ajax: function (url, class_name) {
		this.tpl('loading', null, 240);
		this.loading = url;

		$.get('/ajax/config', $.proxy(function(data) {
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
