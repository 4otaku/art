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
		if (json) {
			data.format = 'json';
		}
		$.ajax({
			url: url,
			data: data ? data: {},
			type: is_get ? 'GET' : 'POST',
			success: success ? function(data) {
				if (data && typeof data.success != 'undefined' && !data.success) {
					if (failure) {
						failure.apply(this, arguments);
					}
				} else {
					success.apply(this, arguments);
				}
			} : false,
			error: failure ? failure : false,
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
		10: 'Слишком большой файл.',
		20: 'Файл не является корректным изображением gif/jpg/png.',
		30: 'Уже есть такое изображение.',
		260: 'Файл не является корректным изображением gif/jpg/png.',
		410: 'Указан неправильный адрес в запросе.',
		420: 'Не все обязательные поля заполнены.',
		430: 'Поля заполнены неправильно.',
		450: 'Недостаточно прав для совершения действия.',
		540: 'Сбой сервера.'
	},

	unknown_error: 'Неизвестная ошибка.',

	translate_error: function(error) {
		if (this.error[error.code]) {
			return this.error[error.code];
		}

		if (error.message) {
			return error.message;
		}

		return this.unknown_error + ' Код ошибки: ' + error.code;
	},

	is_duplicate_error: function(error) {
		return error.code == 30;
	},

	get_duplicate_link: function(data) {
		return '<a href="/'+data.error+'" target="_blank">Посмотреть</a>';
	}
};

// Base OOP functions

function mixin(dst, src) {
	for(var x in src) {
		if((typeof dst[x] == "undefined") || (dst[x] != src[x])) {
			if ($.isPlainObject(dst[x]) && $.isPlainObject(src[x])) {
				dst[x] = $.extend(true, {}, dst[x], src[x]);
			} else {
				dst[x] = src[x];
			}
		}
	}
	if(document.all && !document.isOpera) {
		var p = src.toString;
		if(typeof p == "function" && p != dst.toString &&
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
	var inited = [];
	$.each(INIT, function(type, objects) {
		$.each(objects, function(dev_null, object) {
			if (OBJECT[type]) {
				var id = object[0];
				var values = object[1] || {};
				var events = object[2] || {};
				inited.push(new OBJECT[type](id, values, events));
			}
		});
	});
	$.each(inited, function(key, object) {
		object.el.trigger('init');
	});
	INIT = {};
}

function init(type, id, values, events) {
	events = events || {};
	values = values || {};
	var object = new OBJECT[type](id, values, events);
	object.el.trigger('init');
	return object;
}

// Base object

var OBJECT = {
	base: function (id, values, events) {
		events = events || {};
		values = values || {};
		events = this.extend_events(events, this.events);
		values = $.extend(values, this.values, true);

		this.child = {};
		this.submodule = {};

		this.init_elements(id);
		this.init_values(values);
		this.init_events(events);

		this.id = id;
		this.init_listeners(this.listen);
	}
};
var LISTENERS = {};

mixin(OBJECT.base.prototype, {
	el: false,
	child_config: {},
	submodule_config: {},
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
		if (this.class_name) {
			var postfix = id ? '_' + id : '';
			this.el = $('#' + this.class_name + postfix).first();

			$.each(this.child_config, $.proxy(function(key, value) {
				this.child[key] = this.el.find(value);
			}, this));

			$.each(this.submodule_config, $.proxy(function(key, value) {
				if (typeof value == 'string') {
					value = {type: value};
				}

				this.submodule[key] = init(value.type, (id ? id : '') +
					(value.postfix || ''), value.events || {}, value.values || {});
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
						this.child[key].bind(key2, $.proxy(function(e){
							bind.call(this, e);
						}, this));
					}, this));
				}, this));
			} else {
				if (!$.isArray(event)) {
					event = [event];
				}
				$.each(event, $.proxy(function(dev_null, bind) {
					this.el.bind(key, $.proxy(function(e){
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
			var add = true;
			$.each(LISTENERS[type], $.proxy(function(key, listener){
				if (
					listener.obj.class_name == this.class_name &&
					listener.obj.id == this.id
				) {
					add = false;
					return false;
				}
			}, this));

			if (add) {
				LISTENERS[type].push({obj: this, func: listener});
			}
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

var message = OBJECT.base.prototype.message;


// Common objects

OBJECT.clickable = function(id, values) {
	if (typeof values == 'function') {
		values = {func: values};
	}

	OBJECT.base.call(this, id, values);
};

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

OBJECT.listener = function(id, values) {
	if (typeof values == 'function') {
		var listener = values;
		this.listen = {};
		this.listen[id] = function() {
			listener.apply(this, arguments);
		};
		values = {};
	}

	OBJECT.base.call(this, id, values);
};

extend(OBJECT.listener, OBJECT.base, {
	class_name: 'listener'
});

OBJECT.bb = function(id, values) {
	OBJECT.base.call(this, id, values);

	var text = this.el.html() || '';
	// Decode html entities
	text = $('<div/>').html(text).text();
	this.el.html(this.translate(text));
	this.original = text;
};

extend(OBJECT.bb, OBJECT.base, {
	class_name: 'bb',
	original: '',
	translate: function(text) {
		return this.get_worker().parseHTML(text);
	},
	get_original: function() {
		return this.original;
	},
	get_worker: function() {
		var stc = this.get_static();
		if (!stc.worker) {
			stc.worker = $('<textarea/>').wysibb(wbbparseconfig);
		}
		return stc.worker;
	}
});
