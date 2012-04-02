// Object adding functions

function init_objects(data) {
	$.each(data, function(type, objects) {
		$.each(objects, function(dev_null, object) {
			if (OBJECT[type]) {
				var id = object[0];
				var events = object[1] || {};
				var values = object[2] || {};
				new OBJECT[type](id, events, values);
			}
		});
	});
}

function init(type, id, events, values) {
	events = events || {};
	values = values || {};
	new OBJECT[type](id, events, values);
}

function add_event(events, type, section, fn) {
	if (typeof section == 'function') {
		fn = section;
		section = false;
	}

	events = events || {};

	if (section) {
		events[type] = add_event(events[type], section, fn);
	} else {
		if (typeof events[type] == 'undefined') {
			events[type] = [];
		} else if (!$.isArray(events[type])) {
			events[type] = [events[type]];
		}
		events[type].push(fn);
	}

	return events;
}

// Base object

var OBJECT = {
	base: function (id, events, values) {
		events = events || {};
		values = values || {};

		// default empty values
		this.child = this.child || {};
		this.class_name = this.class_name || '';
		this.id = id || '';

		if (this.class_name && this.id) {
			this.el = $('#' + this.class_name + '_' + this.id).first();

			$.each(this.child, $.proxy(function(key, value) {
				this.child[key] = this.el.find(value);
			}, this));
		} else {
			this.el = false;
			this.child = {};
		}

		$.each(values, $.proxy(function(key, value) {
			this[key] = value;
		}, this));

		$.each(events, $.proxy(function(key, event) {
			if (this.child[key]) {
				$.each(event, $.proxy(function(key2, event2) {
					if (!$.isArray(event2)) {
						event2 = [event2];
					}

					$.each(event2, $.proxy(function(dev_null, bind) {
						this.child[key].on(key2, $.proxy(function(e){
							bind.call(this, e);
						}));
					}, this));
				}, this));
			} else {
				if (!$.isArray(event)) {
					event = [event];
				}
				$.each(event, $.proxy(function(dev_null, bind) {
					this.el.on(key, $.proxy(function(e){
						bind.call(this, e);
					}));
				}, this));
			}
		}, this));
	}
}

// Common objects

OBJECT.clickable = function(id, values) {

	this.class_name = 'clickable';

	events = {
		'click': $.proxy(function() {
			if (this.func) {
				this.func.call(this);
			}
		}, this)
	};

	if (typeof values == 'function') {
		values = {func: values};
	}

	OBJECT.base.call(this, id, events, values);
}

OBJECT.settings = function(id, events, values) {

	this.class_name = 'settings';

	events = add_event(events, 'change', $.proxy(function() {
		var value = this.el.is(':checkbox') ?
			(this.el.attr("checked") == 'checked') - 0 :
			this.el.val();

		$.get('/ajax/set?section=' + this.section + '&key=' +
			this.key + '&value=' + value);
	}, this));

	OBJECT.base.call(this, id, events, values);

	if (this.el.is(':checkbox')) {
		if (this.value == 0) {
			this.el.attr("checked", false);
		} else {
			this.el.attr("checked", "checked");
		}
	} else {
		this.el.val(this.value);
	}
}

OBJECT.form = function(id, values, events) {

	this.class_name = 'form';

	this.child = {
		on_enter: 'input[type=text],input[type=password]',
		submit: '.submit',
		loader: 'div.loader',
		error: 'div.error'
	};

	this.submit = function() {
		if (this.disabled) {
			return;
		}
		data = {};
		this.el.find('input, select, textarea').each(function(){
			if (this.name) {
				data[this.name] = $(this).val();
			}
		});
		this.child.error.hide();
		this.child.submit.hide();
		this.child.loader.show();
		Ajax.perform(this.url, data, $.proxy(function(response) {
			this.child.submit.show();
			this.child.loader.hide();
			if (response.success == false) {
				var message = '';
				$.each(response.errors, function(dev_null, error) {
					error = Ajax.translate_error(error);
					if (error) {
						message += error + '<br />';
					}
				});
				this.child.error.html(message).show();
			} else {
				this.success.call(this, data);
			}
		}, this), $.proxy(function(response) {
			this.child.submit.show();
			this.child.loader.hide();
		}, this));
	}

	events = add_event(events, 'on_enter', 'keydown', $.proxy(function(e) {
		if (e.which == 13) {
			this.submit.call(this);
		}
	}, this));
	events = add_event(events, 'submit', 'click', $.proxy(this.submit, this));

	OBJECT.base.call(this, id, events, values);
}

// Ajax functions

var Ajax = {
	perform: function(url, data, success, failure) {
		$.ajax({
			url: url,
			data: data ? data: {},
			type: 'POST',
			success: success ? success : false,
			failure: failure ? failure : false,
			dataType: 'json'
		});
	},

	error: {
		410: 'Указан неправильный адрес в запросе.'
	},

	translate_error: function(error) {
		if (this.error[error.code]) {
			return this.error[error.code];
		}

		if (error.message) {
			return error.message;
		}

		return 'Код ошибки: ' + error.code;
	}
}
