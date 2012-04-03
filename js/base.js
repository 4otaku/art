// Base OOP functions

function mixin(dst, src) {
	var tobj = {}
	for(var x in src) {
		if((typeof tobj[x] == "undefined") || (tobj[x] != src[x])) {
			dst[x] = src[x];
		}
	}
	if(document.all && !document.isOpera) {
		var p = src.toString;
		if(typeof p == "function" && p != dst.toString && p != tobj.toString &&
			p != "\nfunction toString() {\n    [native code]\n}\n") {

			dst.toString = src.toString;
		}
	}
}

function extend(Child, Parent, mixinData) {
	var F = function() {};
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
	Child.superclass = Parent.prototype;

	if (typeof mixinData == 'object') {
		mixin(Child.prototype, mixinData);
	}
}

// Object adding functions

function init_objects(data) {
	$.each(data, function(type, objects) {
		$.each(objects, function(dev_null, object) {
			if (OBJECT[type]) {
				var id = object[0];
				var values = object[1] || {};
				var events = object[2] || {};
				new OBJECT[type](id, values, events);
			}
		});
	});
}

function init(type, id, values, events) {
	events = events || {};
	values = values || {};
	new OBJECT[type](id, values, events);
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
	base: function (id, values, events) {
		events = events || {};
		values = values || {};
		events = this.extend_events(events, this.events);
		values = $.extend(values, this.values, true);

		this.init_elements(id);
		this.init_values(values);
		this.init_events(events);
	}
}

mixin(OBJECT.base.prototype, {
	child: {},
	class_name: 'base',
	id: '',
	events: {},
	values: {},

	extend_events: function(from, to) {
		$.each(to, $.proxy(function(key, value) {
			if (from[key] == undefined) {
				from[key] = to[key];
			} else {
				if (!$.isArray(value) && typeof value == 'object') {
					$.each(to[key], $.proxy(function(key2, value2) {
						if (from[key][key2] == undefined) {
							from[key][key2] = value2;
						} else {
							if (!$.isArray(from[key][key2])) {
								from[key][key2] = [from[key][key2]];
							}
							from[key][key2].push(value2);
						}
					}, this));
				} else {
					if (!$.isArray(from[key])) {
						from[key] = [from[key]];
					}
					from[key].push(value);
				}
			}
		}, this));

		return from;
	},

	init_elements: function(id) {
		if (this.class_name && id) {
			this.el = $('#' + this.class_name + '_' + id).first();

			$.each(this.child, $.proxy(function(key, value) {
				this.child[key] = this.el.find(value);
			}, this));
		} else {
			this.el = false;
			this.child = {};
		}
	},

	init_values: function(values) {
		$.each(values, $.proxy(function(key, value) {
			this[key] = value;
		}, this));
	},

	init_events: function(events) {
		$.each(events, $.proxy(function(key, event) {
			if (this.child[key]) {
				$.each(event, $.proxy(function(key2, event2) {
					if (!$.isArray(event2)) {
						event2 = [event2];
					}

					$.each(event2, $.proxy(function(dev_null, bind) {
						this.child[key].on(key2, $.proxy(function(e){
							bind.call(this, e);
						}, this));
					}, this));
				}, this));
			} else {
				if (!$.isArray(event)) {
					event = [event];
				}
				$.each(event, $.proxy(function(dev_null, bind) {
					this.el.on(key, $.proxy(function(e){
						bind.call(this, e);
					}, this));
				}, this));
			}
		}, this));
	}
});


// Common objects

OBJECT.clickable = function(id, values) {
	if (typeof values == 'function') {
		values = {func: values};
	}

	OBJECT.clickable.superclass.constructor.call(this, id, values);
}

extend(OBJECT.clickable, OBJECT.base, {
	class_name: 'clickable',
	events: {
		click: function() {
			if (this.func) {
				this.func.call(this);
			}
		}
	}
});

OBJECT.settings = function(id, values, events) {

	OBJECT.settings.superclass.constructor.call(this, id, values, events);

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

extend(OBJECT.settings, OBJECT.base, {
	class_name: 'settings',
	events: {
		change: function() {
			var value = this.el.is(':checkbox') ?
				(this.el.attr("checked") == 'checked') - 0 :
				this.el.val();

			$.get('/ajax/set?section=' + this.section + '&key=' +
				this.key + '&value=' + value);
		}
	}
});

OBJECT.form = function(id, values, events) {

	values.validate = values.validate ? values.validate : {};

	OBJECT.base.call(this, id, values, events);
}

extend(OBJECT.form, OBJECT.base, {
	class_name: 'form',
	child: {
		on_enter: 'input[type=text],input[type=password]',
		submit: '.submit',
		loader: 'div.loader',
		error: 'div.error'
	},
	submit: function() {
		var data = this.get_data();

		if (data.error.length) {
			this.child.error.html(data.error.join('<br />')).show();
			return;
		}

		this.child.error.hide();
		this.child.submit.hide();
		this.child.loader.show();

		Ajax.perform(this.url, data.data, $.proxy(function(response) {
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
				this.success.call(this, response);
			}
		}, this), $.proxy(function(response) {
			this.child.submit.show();
			this.child.loader.hide();
		}, this));
	},
	get_data: function() {
		var data = {};
		var error = [];
		var me = this;
		this.el.find('input, select, textarea').each(function() {
			if (this.name) {
				var val = $(this).val();
				if (me.validate[this.name]) {
					if (typeof me.validate[this.name] == 'object') {
						var params = me.validate[this.name];
						var fn = me.validate[this.name].fn;
					} else {
						var params = {};
						var fn = me.validate[this.name];
					}

					var errorText = fn.call(me, val, params);

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
	events: {
		on_enter: {
			keydown: function(e) {
				if (e.which == 13) {
					this.submit();
				}
			}
		},
		submit: {
			click: function() {
				this.submit();
			}
		}
	}
});

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
	}
}
