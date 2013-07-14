OBJECT.settings = function(id, values, events) {

	OBJECT.settings.super.constructor.call(this, id, values, events);

	this.is_checkbox = this.el.is(':checkbox');

	if (this.is_checkbox) {
		if (this.value == 0) {
			this.el.attr("checked", false);
		} else {
			this.el.attr("checked", "checked");
		}
	} else {
		this.el.val(this.value);
	}
};

extend(OBJECT.settings, OBJECT.base, {
	class_name: 'settings',
	events: {
		change: function() {
			Ajax.get('/ajax/setting', {
				section: this.section,
				key: this.key,
				value: this.get_value()
			});
		}
	},
	get_value: function() {
		return this.is_checkbox ?
			(this.el.attr("checked") == 'checked') - 0 :
			this.el.val();
	}
});

OBJECT.settings_overlay = function(id, values, events) {
	OBJECT.settings_overlay.super.constructor.call(this, id, values, events);
};

extend(OBJECT.settings_overlay, OBJECT.settings, {
	class_name: 'settings_overlay',
	events: {
		change: function() {
			this.get_super().events.change.call(this);
			Overlay.need_reload = true;
		}
	}
});

OBJECT.settings_reload = function(id, values, events) {
	OBJECT.settings_reload.super.constructor.call(this, id, values, events);
};

extend(OBJECT.settings_reload, OBJECT.settings, {
	class_name: 'settings_reload',
	events: {
		change: function() {
			var url = '/ajax/set?section=' + this.section + '&key=' +
				this.key + '&value=' + this.get_value();

			$.get(url, function() {
				document.location.reload();
			});
		}
	}
});

OBJECT.settings_rss = function(id, values, events) {
	this.key = id;
	this.value = User.rss[this.key];

	OBJECT.settings_rss.super.constructor.call(this, id, values, events);
};

extend(OBJECT.settings_rss, OBJECT.settings, {
	class_name: 'settings_rss',
	section: 'rss',
	events: {
		change: function() {
			this.get_super().events.change.call(this);
			User.rss[this.key] = this.get_value();
		}
	}
});

OBJECT.filter_edit = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.filter_edit, OBJECT.base, {
	class_name: 'filter_edit',
	child_config: {
		add: '.filter-add',
		do_add: '.filter-add button',
		value: '.filter-add select',
		key: '.filter-add input',
		container: '.filter-container'
	},
	events: {
		do_add: {
			click: function(e) {
				e.preventDefault();
				var key = this.child.key.val();
				var val = this.child.value.val();

				if (!key || !val) {
					return;
				}

				var add = this.child.add.clone();
				this.child.key.val('');

				add.find('button').remove();
				add.find('input').remove();
				add.find('option').show();
				add.find('span').html('Арты с тегом: "' + key + '"');
				add.find('select').attr('id', 'settings_overlay_filter_' + key);
				this.child.container.append(add);

				init('settings_overlay', 'filter_' + key, {
					section: 'filter', key: key, value: val
				});
				add.find('select').change();
			}
		}
	}
});
