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
	errors: {
		unexpected: 'Непредвиденная ошибка. Сообщите о ней администратору, пожалуйста.'
	},
	on_load: function(data) {
		this.child.loader.hide();
		this.child.form.html('').show().html(data);
		this.child.save_wrapper.show();
	},
	on_load_failure: function() {
		this.child.loader.hide();
		this.child.error.html(this.errors.unexpected).show();
	},
	listen: {
		edit_load: function(type, mode, id) {
			this.el.show();
			this.child.form.hide();
			this.child.save_wrapper.hide();
			this.child.loader.show();
			this.child.error.hide();
			this.child.success.hide();
			Ajax.load('/ajax/edit/' + type, {mode: mode, id: id},
				this.on_load, this.on_load_failure, this);
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