function object_base(id, events, values) {
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

function clickable(id, values) {

	this.class_name = 'clickable';

	events = {
		'click': $.proxy(function() {
			if (this.func) {
				this.func.call(this);
			}
		}, this)
	};

	object_base.call(this, id, events, values);
}

new clickable(32, {func: function(){alert('nya');}});
/*
//
$.proxy(function () {
     //use original 'this'
 },this)
*/
