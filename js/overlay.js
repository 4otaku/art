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
			'<span class="overlay_content"></span>',
		test: 'Hello world'
	}
}
