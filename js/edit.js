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
	child_config: {
		add: '.add',
		edit: '.edit',
		move: '.move',
		delete: '.delete'
	},
	set_state: function(state) {
		this.message('change_translation_state', state);
		this.child.add.removeClass('active');
		this.child.edit.removeClass('active');
		this.child.move.removeClass('active');
		this.child.delete.removeClass('active');
		if (this.child[state]) {
			this.child[state].addClass('active');
		}
	},
	events: {
		init: function() {
			this.child.edit.click();
		},
		add: {
			click: function() {
				this.set_state('add');
			}
		},
		edit: {
			click: function() {
				this.set_state('edit');
			}
		},
		move: {
			click: function() {
				this.set_state('move');
			}
		},
		delete: {
			click: function() {
				this.set_state('delete');
			}
		}
	},
	listen: {
		edit_cancel: function(){
			this.set_state('view');
		}
	}
});

OBJECT.edit_source = function(id, values, events) {
	OBJECT.edit_simple.call(this, id, values, events);
};

extend(OBJECT.edit_source, OBJECT.edit_simple, {
	class_name: 'edit_source'
});

