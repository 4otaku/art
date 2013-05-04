OBJECT.edit_form = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.edit_form, OBJECT.base, {
	class_name: 'edit_form',
	child_config: {
		cancel: '.cancel',
		form: '.form',
		save_wrapper: '.save',
		save: '.save button',
		loader: '.loader',
		error: '.error',
		success: '.success'
	},
	data: {},
	data_id: 0,
	api: '',
	errors: {
		420: 'Не произведено никаких изменений',
		unexpected: 'Непредвиденная ошибка. Сообщите о ней администратору, пожалуйста.'
	},
	on_load: function(data) {
		this.child.loader.hide();
		this.child.form.html('').show().html(data);
		this.child.save_wrapper.show();
	},
	on_save: function(data) {
		if (!data.success) {
			this.on_save_failure(data);
			return;
		}
		this.child.form.hide();
		this.child.loader.hide();
		this.child.success.show();
		this.message('art_reload', function(){
			this.el.hide();
		}, this);
	},
	on_load_failure: function() {
		this.child.loader.hide();
		this.child.error.html(this.errors.unexpected).show();
	},
	on_save_failure: function(data) {
		var error = data.errors[0].code;
		this.child.loader.hide();
		this.child.save_wrapper.show();
		this.child.error.html(this.errors[error] ? this.errors[error] :
			this.errors.unexpected).show();
	},
	events: {
		cancel: {
			click: function() {
				this.el.hide();
				this.message('edit_cancel');
			}
		},
		save: {
			click: function() {
				if (this.child.save.is('.disabled')) {
					return;
				}
				this.message('edit_save');

				this.child.loader.hide();
				this.child.error.hide();
				this.child.save_wrapper.hide();
				var send = $.extend({}, this.data);
				send.id = this.data_id;
				Ajax.perform('/ajax/save/', {data: send, api: this.api},
					this.on_save, this.on_save_failure, this);
			}
		}
	},
	listen: {
		edit_load: function(type, mode, id) {
			this.el.show();
			this.child.form.hide();
			this.child.save_wrapper.hide();
			this.child.loader.show();
			this.child.error.hide();
			this.child.success.hide();
			this.data_id = id;
			this.api = mode == 'art' ? type : mode + '_' + type;
			Ajax.load('/ajax/edit/' + type, {mode: mode, id: id},
				this.on_load, this.on_load_failure, this);
		},
		edit_data_change: function(data, have_changes) {
			this.data = data;

			if (have_changes) {
				this.child.save.removeClass('disabled');
			} else {
				this.child.save.addClass('disabled');
			}
		}
	}
});

OBJECT.edit_start = function(id, values, events) {
	values.id_item = id.split('_')[1];
	values.type = id.split('_')[0];

	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.edit_start, OBJECT.base, {
	class_name: 'edit_start',
	mode: '',
	type: '',
	id_item: '',
	events: {
		click: function() {
			this.message('edit_load', this.type,
				this.mode ? 'art_' + this.mode : 'art', this.id_item);
		}
	}
});

OBJECT.edit_simple = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.edit_simple, OBJECT.base, {
	class_name: 'edit_simple',
	start_data: {},
	child_config: {
		fields: 'input, select, textarea'
	},
	gather_data: function() {
		var data = {};
		this.child.fields.each(function(){
			if (this.name) {
				data[this.name] = $(this).val();
			}
		});
		return data;
	},
	events: {
		init: function() {
			this.start_data = this.gather_data();
		},
		fields: {
			keyup: function() {
				var data = this.gather_data(),
					send_data = {},
					have_changes = false;
				$.each(data, $.proxy(function(name, value){
					if (this.start_data[name] != value) {
						send_data[name] = value;
						have_changes = true;
					}
				}, this));
				this.message('edit_data_change', send_data, have_changes);
			}
		}
	}
});

OBJECT.edit_tags = function(id, values, events) {
	OBJECT.ajax_tip.call(this, id, values, events);

	this.child.field.css('overflow', 'hidden').autogrow();
};

extend(OBJECT.edit_tags, OBJECT.ajax_tip, {
	class_name: 'edit_tags',
	address: 'tip_tag',
	max_tip_length: 120,
	start_terms: [],
	minimum_term_length: 1,
	child_config: {
		field: '.tags',
		tip: '.tips'
	},
	events: {
		init: function() {
			this.start_terms = this.get_terms();
		},
		field: {
			keyup: function() {
				var terms = this.get_terms(),
					add = $(terms).not(this.start_terms).toArray(),
					remove = $(this.start_terms).not(terms).toArray(),
					have_changes = add.length || remove.length;
				this.message('edit_data_change', {add: add, remove: remove},
					have_changes);
			}
		}
	}
});

OBJECT.edit_translation = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.edit_translation, OBJECT.base, {
	class_name: 'edit_translation',
	state_pointer: 0,
	in_active_change: false,
	state: [],
	child_config: {
		add: '.add',
		edit: '.edit',
		move: '.move',
		delete: '.delete',
		undo: '.undo',
		redo: '.redo'
	},
	set_mode: function(mode) {
		this.message('change_translation_mode', mode);
		this.child.add.removeClass('active');
		this.child.edit.removeClass('active');
		this.child.move.removeClass('active');
		this.child.delete.removeClass('active');
		if (this.child[mode]) {
			this.child[mode].addClass('active');
		}
	},
	write_state: function(initial) {
		if (initial) {
			this.state_pointer = 0;
			this.state = [];
		} else {
			this.state_pointer = this.state_pointer + 1;
			// Deleting obsolete redo history
			this.state = this.state.slice(0, this.state_pointer);
		}
		this.state.push({});

		this.message('translation_state_report');

		return (initial && !$.isEmptyObject(this.state[0]));
	},
	display_state: function(index) {
		if (!this.state[index]) {
			return;
		}

		this.state_pointer = index;
		this.message('translation_state_set', this.state[index]);
		this.display_arrows();
		this.prepare_data();
	},
	display_arrows: function() {
		if (this.state_pointer > 0 || this.in_active_change) {
			this.child.undo.css('visibility', 'inherit');
		} else {
			this.child.undo.css('visibility', 'hidden');
		}

		if (this.state.length > (this.state_pointer + 1)) {
			this.child.redo.css('visibility', 'inherit');
		} else {
			this.child.redo.css('visibility', 'hidden');
		}
	},
	prepare_data: function() {
		var data = this.state[this.state_pointer],
			initial = this.state[0],
			send = [];
		$.each(data, function(id, data){
			var before = initial[id],
				changed = false,
				add = {};

			if (!data[6]) {
				add.id = id;
				if (data[5] && before) {
					add.delete = 1;
					send.push(add);
					return;
				}
			}

			if (!before || before[0] != data[0]) {
				add.x1 = data[0];
				changed = true;
			}
			if (!before || before[1] != data[1]) {
				add.x2 = data[1];
				changed = true;
			}
			if (!before || before[2] != data[2]) {
				add.y1 = data[2];
				changed = true;
			}
			if (!before || before[3] != data[3]) {
				add.y2 = data[3];
				changed = true;
			}
			if (!before || before[4] != data[4]) {
				add.text = data[4];
				changed = true;
			}
			if (changed) {
				send.push(add);
			}
		});

		this.message('edit_data_change', {change: send}, send.length);
	},
	events: {
		init: function() {
			if (this.write_state(true)) {
				this.child.edit.click();
			} else {
				this.child.add.click();
			}
		},
		add: {
			click: function() {
				this.set_mode('add');
			}
		},
		edit: {
			click: function() {
				this.set_mode('edit');
			}
		},
		move: {
			click: function() {
				this.set_mode('move');
			}
		},
		delete: {
			click: function() {
				this.set_mode('delete');
			}
		},
		undo: {
			click: function() {
				if (this.in_active_change) {
					this.display_state(this.state_pointer);
					this.in_active_change = false;
				} else {
					this.display_state(this.state_pointer - 1);
				}
			}
		},
		redo: {
			click: function() {
				this.display_state(this.state_pointer + 1);
				this.in_active_change = false;
			}
		}
	},
	listen: {
		edit_cancel: function(){
			this.set_mode('view');
		},
		edit_save: function(){
			this.message('translation_edit_save');
		},
		translation_state: function(id, state) {
			this.state[this.state_pointer][id] = state;
		},
		translation_change_start: function() {
			this.in_active_change = true;
			this.display_arrows();
		},
		translation_change_end: function() {
			this.in_active_change = false;
			this.write_state();
			this.display_arrows();
			this.prepare_data();
		}
	}
});

OBJECT.edit_source = function(id, values, events) {
	OBJECT.edit_simple.call(this, id, values, events);
};

extend(OBJECT.edit_source, OBJECT.edit_simple, {
	class_name: 'edit_source'
});

