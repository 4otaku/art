// Ajax functions

var Ajax = {
	request: function(url, data, success, failure, scope, json, is_get) {
		if (typeof data == 'function') {
			scope = failure;
			failure = success;
			success = data;
			data = {};
		}
		if (typeof failure == 'object') {
			scope = failure;
		}
		data.format = 'json';
		$.ajax({
			url: url,
			data: data ? data: {},
			type: is_get ? 'GET' : 'POST',
			success: success ? success : false,
			failure: failure ? failure : false,
			context: scope ? scope : this,
			dataType: json ? 'json' : 'html'
		});
	},

	get: function(url, data, success, failure, scope) {
		this.request(url, data, success, failure, scope, true, true);
	},

	load: function(url, data, success, failure, scope) {
		this.request(url, data, success, failure, scope, false, true);
	},

	perform: function(url, data, success, failure, scope) {
		this.request(url, data, success, failure, scope, true, false);
	},

	error: {
		410: 'Указан неправильный адрес в запросе.',
		420: 'Не все обязательные поля заполнены',
		430: 'Поля заполнены неправильно'
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
	Child.super = Parent.prototype;

	if (typeof mixinData == 'object') {
		mixin(Child.prototype, mixinData);
	}
}

// Object adding functions

function init_objects() {
	$.each(INIT, function(type, objects) {
		$.each(objects, function(dev_null, object) {
			if (OBJECT[type]) {
				var id = object[0];
				var values = object[1] || {};
				var events = object[2] || {};
				new OBJECT[type](id, values, events);
			}
		});
	});
	INIT = {};
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

		this.child = {};

		this.init_elements(id);
		this.init_values(values);
		this.init_events(events);
		this.init_listeners(this.listen);

		this.id = id;
	}
}
var LISTENERS = {};

mixin(OBJECT.base.prototype, {
	el: false,
	child_config: {},
	class_name: 'base',
	id: '',
	events: {},
	values: {},
	listen: {},

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

			$.each(this.child_config, $.proxy(function(key, value) {
				this.child[key] = this.el.find(value);
			}, this));
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
	},

	init_listeners: function(listeners) {
		$.each(listeners, $.proxy(function(type, listener) {
			if (!LISTENERS[type]) {
				LISTENERS[type] = [];
			}
			LISTENERS[type].push({obj: this, func: listener});
		}, this));
	},

	get_static: function() {
		return OBJECT[this.class_name];
	},

	get_super: function() {
		return this.get_static().super;
	},

	message: function(type) {
		if (!LISTENERS[type]) {
			return;
		}
		var params = Array.prototype.slice.call(arguments);
		params.shift();
		$.each(LISTENERS[type], function(dev_null, listener) {
			listener.func.apply(listener.obj, params);
		});
	},

	on_outside_click: function(target, fn) {
		$('body').one('click', $.proxy(function(e) {
			fn.call(this, e);
			target.off('click.propagation');
		}, this));
		target.on('click.propagation', function(e){
			e.stopPropagation();
		});
	}
});


// Common objects

OBJECT.clickable = function(id, values) {
	if (typeof values == 'function') {
		values = {func: values};
	}

	OBJECT.clickable.super.constructor.call(this, id, values);
}

extend(OBJECT.clickable, OBJECT.base, {
	class_name: 'clickable',
	events: {
		click: function(e) {
			if (this.func) {
				this.func.call(this, e);
			}
		}
	}
});
