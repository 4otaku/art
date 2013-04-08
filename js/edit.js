OBJECT.editfield = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.editfield, OBJECT.base, {
	class_name: 'editfield',
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
		this.child.loader.hide();
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
				Ajax.perform('/ajax/save/', {data: this.data, api: this.api},
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
			this.data.id = id;
			this.api = mode == 'art' ? type : mode + '_' + type;
			Ajax.load('/ajax/edit/' + type, {mode: mode, id: id},
				this.on_load, this.on_load_failure, this);
		},
		edit_data_change: function(data) {
			this.data = $.extend(this.data, data);
			if (this.data.add.length || this.data.remove.length) {
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
				var terms = this.get_terms();
				this.message('edit_data_change', {
					add: $(terms).not(this.start_terms).toArray(),
					remove: $(this.start_terms).not(terms).toArray()
				});
			}
		}
	}
});