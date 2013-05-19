OBJECT.admin_tag_hover = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.admin_tag_hover, OBJECT.base, {
	class_name: 'admin_tag_hover',
	child_config: {
		display: ':not(input,select,option)',
		field: 'input,select'
	},
	focused: false,
	save: function() {
		var data = {};
		data[this.type] = this.get_val();
		Ajax.perform('/ajax/save', {
			api: 'art_tag',
			id: this.id,
			data: data
		});
	},
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
			},
			change: function() {
				if (this.is_select) {
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
	type: 'name'
});

OBJECT.admin_tag_variant = function(id, values, events) {
	OBJECT.admin_tag_hover.call(this, id, values, events);
};

extend(OBJECT.admin_tag_variant, OBJECT.admin_tag_hover, {
	class_name: 'admin_tag_variant',
	type: 'variant',
	get_val: function() {
		var val = this.get_super().get_val.call(this);
		return $.grep(val.split(/[, ]/), function(value){
			return !!value;
		});
	}
});

OBJECT.admin_tag_color = function(id, values, events) {
	OBJECT.admin_tag_hover.call(this, id, values, events);
};

extend(OBJECT.admin_tag_color, OBJECT.admin_tag_hover, {
	class_name: 'admin_tag_color',
	type: 'color',
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
				api: 'art_tag',
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
				api: 'art_tag',
				id: to_first ? this.id : item.id,
				merge: to_first ? item.id : this.id
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