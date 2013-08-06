OBJECT.form = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.form, OBJECT.base, {
	class_name: 'form',
	child_config: {
		datafields: 'input,select,textarea',
		on_enter: 'input[type=text],input[type=password]',
		submit: '.submit',
		success: 'div.success',
		loader: 'div.loader',
		error: 'div.error'
	},
	add_data: {},
	validate: {},
	api: false,
	submit: function(e) {
		e.preventDefault();
		var data = this.get_data();

		if (data.error.length) {
			this.child.error.html(data.error.join('<br />')).show();
			return;
		}

		this.child.error.hide();
		this.child.submit.hide();
		this.child.loader.show();

		data = this.prepare_data(data);

		var fn = this.api ? Ajax.api : Ajax.perform;
		var request = this.api ? this.api : this.url;

		fn.call(Ajax, request, data, $.proxy(function(response) {
			this.child.submit.show();
			this.child.loader.hide();
			this.success.call(this, response);
		}, this), $.proxy(function(response) {
			var message = '';
			$.each(response.errors || [{code: 0}], function(dev_null, error) {
				error = Ajax.translate_error(error);
				if (error) {
					message += error + '<br />';
				}
			});
			this.child.submit.show();
			this.child.loader.hide();
			this.child.error.html(message).show();
		}, this));
	},
	prepare_data: function(data) {
		return $.extend(data.data, this.add_data);
	},
	get_data: function() {
		var data = {};
		var error = [];
		var me = this;
		this.child.datafields.each(function() {
			if (this.name) {
				var val = $(this).val();
				if (me.validate[this.name]) {
					if (!$.isArray(me.validate[this.name])) {
						me.validate[this.name] = [me.validate[this.name]];
					}

					var errorText = false;
					$.each(me.validate[this.name], $.proxy(function(dev_null, validate) {
						if (typeof errorText == 'string') {
							return;
						}

						var params = {},
							fn = validate;
						if (typeof validate == 'object') {
							params = validate;
							fn = validate.fn;
						}

						errorText = fn.call(me, val, params);
					}, this));


					if (typeof errorText == 'string' && error.indexOf(errorText) == -1) {
						error.push(errorText);
					}
				}
				data[this.name] = val;
			}
		});
		return {
			error: error,
			data: data
		}
	},
	success_overlay: function(text) {
		this.child.error.hide();
		this.child.submit.hide();
		this.child.loader.hide();
		this.child.success.html(text).show();
		setTimeout(Overlay.close, 5000);
	},
	events: {
		on_enter: {
			keydown: function(e) {
				if (e.which == 13) {
					this.submit(e);
				}
			}
		},
		submit: {
			click: function(e) {
				this.submit(e);
			}
		}
	}
});

// Validations

var Validate = {
	email: function(email, params) {
		if (email.match(/^\s*[a-z\d\_\-\.]+@[a-z\d\_\-\.]+\.[a-z]{2,5}\s*$/i)) {
			return true;
		}

		return 'Указан некорректный емейл.';
	},

	non_empty: function(value, params) {
		if (value) {
			return true;
		}

		return 'Не все обязательные поля заполнены';
	},

	match: function(value, params) {
		var field = this.el.find('[name=' + params.field + ']');

		if (field.length == 0) {
			return true;
		}

		if (field.val() == value) {
			return true;
		}

		return params.text;
	},

	url: function(value, params) {
		var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		if (regexp.test(value)) {
			return true;
		}

		return 'Указана некорректная ссылка.';
	}
};
