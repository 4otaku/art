Overlay = {
	tpl: function (template, class_name) {
		this.html(this.templates[template], class_name);
	},

	ajax: function (url, class_name) {
		this.tpl('loading', 'loading');
	},

	html: function (html, class_name) {
		class_name = class_name || 'box';
		$(".overlay").remove();

		var div = $('<div/>').addClass('overlay_' + class_name)
			.html(html).appendTo('body');

		div.overlay({
			top: 260,
			mask: {
				color: '#fff',
				loadSpeed: 200,
				opacity: 0.5
			},
			closeOnClick: false,
			load: true
		});
	},

	templates: {
		loading: 'Hello world',
		test: 'Hello world'
	}
}
