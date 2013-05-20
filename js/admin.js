OBJECT.admin_tag_hover = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.admin_tag_hover, OBJECT.base, {
	class_name: 'admin_tag_hover',
	child_config: {
		display: ':not(input,select,option)',
		field: 'input,select'
	},
	error_message: '',
	focused: false,
	init_val: '',
	save: function() {
		this.message('admin_tag_error', false);
		var data = {id: this.id};
		data[this.type] = this.get_val();

		this.child.display.css('visibility', 'hidden');
		this.child.field.css('visibility', 'hidden');
		this.el.addClass('loader').css('margin', 0).show();

		Ajax.perform('/ajax/save', {
			api: 'tag_art',
			data: data
		}, this.on_save, function(){
			this.message('admin_tag_error', this.error_message);
			this.on_save();
		}, this);
	},
	on_save: function() {
		Ajax.get('/ajax/tag', {id: this.id},
			this.on_reload, this.on_reload, this);
	},
	on_reload: function(result) {
		this.set_val(result.data[0]);
		this.child.display.css('visibility', 'inherit');
		this.child.field.css('visibility', 'inherit');
		this.el.removeClass('loader');
		this.focused = false;
		this.blur();
	},
	set_val: function(data) {},
	get_val: function() {
		return this.child.field.val();
	},
	focus: function() {
		this.child.display.hide();
		this.child.field.show();
	},
	blur: function() {
		this.child.display.show();
		this.child.field.hide();
	},
	events: {
		init: function() {
			this.child.field.val(this.init_val);
		},
		mouseenter: function() {
			this.focus();
		},
		mouseleave: function() {
			if (!this.focused) {
				this.blur();
			}
		},
		field: {
			focus: function() {
				this.focused = true;
				this.focus();
			},
			blur: function() {
				this.focused = false;
				this.blur();
			},
			keydown: function(e) {
				if (e.which == 13) {
					this.save();
				}
			}
		}
	}
});

OBJECT.admin_tag_name = function(id, values, events) {
	OBJECT.admin_tag_hover.call(this, id, values, events);
};

extend(OBJECT.admin_tag_name, OBJECT.admin_tag_hover, {
	class_name: 'admin_tag_name',
	error_message: 'Тег с таким именем уже существует',
	type: 'name',
	set_val: function(data) {
		this.child.field.val(data.name);
		this.child.display.html(data.name);
	}
});

OBJECT.admin_tag_variant = function(id, values, events) {
	OBJECT.admin_tag_hover.call(this, id, values, events);
};

extend(OBJECT.admin_tag_variant, OBJECT.admin_tag_hover, {
	class_name: 'admin_tag_variant',
	error_message: 'Часть вариантов совпала с существующими тегами и не была сохранена',
	type: 'variant',
	get_val: function() {
		var val = this.get_super().get_val.call(this);
		val = $.grep(val.split(/[, ]/), function(value){
			return !!value;
		});
		return val.length ? val : 0;
	},
	set_val: function(data) {
		this.child.field.val(data.variant.join(', '));
		this.child.display.html(data.variant.join(', '));
	}
});

OBJECT.admin_tag_color = function(id, values, events) {
	OBJECT.admin_tag_hover.call(this, id, values, events);
};

extend(OBJECT.admin_tag_color, OBJECT.admin_tag_hover, {
	class_name: 'admin_tag_color',
	type: 'color',
	set_val: function(data) {
		this.child.field.val(data.color);
		var text = this.child.field.children(':selected').text();
		this.child.display.html(text);
		this.child.display.css('color', '#' + data.color);
	},
	events: {
		field: {
			change: function() {
				this.save();
			}
		}
	}
});

OBJECT.admin_tag_delete = function(id, values, events) {
	OBJECT.clickable.call(this, id, function() {
		if (confirm('Вы действительно желаете удалить тег ' + values)) {
			Ajax.perform('/ajax/delete', {
				api: 'tag_art',
				id: this.id
			}, function() {
				document.location.reload();
			}, function() {
				document.location.reload();
			});
		}
	}, events);
};

extend(OBJECT.admin_tag_delete, OBJECT.clickable, {
	class_name: 'admin_tag_delete'
});

OBJECT.admin_tag_start_merge = function(id, values, events) {
	OBJECT.clickable.call(this, id, function() {
		this.message('admin_tag_error', false);
		Overlay.ajax('/ajax/tag_merge?id=' + id);
	}, events);
};

extend(OBJECT.admin_tag_start_merge, OBJECT.clickable, {
	class_name: 'admin_tag_start_merge'
});

OBJECT.admin_tag_merge = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.admin_tag_merge, OBJECT.clickable, {
	class_name: 'admin_tag_merge',
	child_config: {
		second: 'input',
		loader: '.loader',
		error: '.error',
		to_first: '.to_first',
		to_second: '.to_second'
	},
	do_merge: function(to_first) {
		this.child.error.hide();

		var val = this.child.second.val();
		if (!val) {
			return;
		}

		this.child.loader.show();
		Ajax.get('/ajax/tag', {name: val}, function(data){
			if (!data.count) {
				this.child.loader.hide();
				this.child.error.html('Тег с именем ' + val + ' не найден').show();
				return;
			}
			var item = data.data[0];
			if (item.id == this.id) {
				this.child.loader.hide();
				this.child.error.html('Нельзя слить тег с самим собой').show();
				return;
			}

			Ajax.perform('/ajax/save', {
				api: 'tag_art',
				data: {
					id: to_first ? this.id : item.id,
					merge: to_first ? item.id : this.id
				}
			}, function(){
				document.location.reload();
			}, function(){
				document.location.reload();
			});
		}, function() {
			this.child.loader.hide();
			this.child.error.html('Неизвестная ошибка').show();
		}, this);
	},
	events: {
		to_first: {
			click: function() {
				this.do_merge(true);
			}
		},
		to_second: {
			click: function() {
				this.do_merge();
			}
		}
	}
});

OBJECT.admin_similar = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.id_first = this.id.split('_')[0];
	this.id_second = this.id.split('_')[1];
};

extend(OBJECT.admin_similar, OBJECT.base, {
	class_name: 'admin_similar',
	child_config: {
		first_main: '.first_main',
		second_main: '.second_main',
		mistake: '.mistake'
	},
	start_loading: function() {
		this.el.children().hide();
		this.el.addClass('loader');
	},
	stop_loading: function() {
		this.el.children().show();
		this.el.removeClass('loader');
	},
	delete_pair: function() {
		Ajax.perform('/ajax/delete', {
			api: 'art_similar',
			data: {
				id_first: this.id_first,
				id_second: this.id_second
			}
		}, function(){
			this.el.remove();
		}, function(){
			this.stop_loading();
		}, this);
	},
	make_similar: function(main, variation) {
		this.start_loading();
		Ajax.perform('/ajax/save', {
			api: 'art_variation',
			data: {id: main, add: [{id: variation}]}
		}, function(){
			this.child.first_main.remove();
			this.child.second_main.remove();
			this.delete_pair();
		}, function(){
			this.stop_loading();
		}, this);
	},
	events: {
		first_main: {
			click: function() {
				this.make_similar(this.id_first, this.id_second);
			}
		},
		second_main: {
			click: function() {
				this.make_similar(this.id_second, this.id_first);
			}
		},
		mistake: {
			click: function() {
				this.start_loading();
				this.delete_pair();
			}
		}
	}
});