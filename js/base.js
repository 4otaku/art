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

// Base object

var OBJECT = {}

OBJECT.base = function (id, events, values) {
	events = events || {};
	values = values || {};

	// default empty values
	this.child = this.child || {};
	this.class_name = this.class_name || '';
	this.id = id || '';

	if (this.class_name && this.id) {
		this.el = $('#' + this.class_name + '_' + this.id).first();

		$.each(this.child, $.proxy(function(key, value) {
			this.child[key] = this.el.find(value).first();
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

	events = events || {};
	events.change = events.change ? [events.change] : [];

	events.change.push($.proxy(function() {
		$.get('/ajax/set?section=' + this.section + '&key=' +
			this.key + '&value=' + this.value);
	}, this));

	OBJECT.base.call(this, id, events, values);

	this.el.val(this.value);
}
