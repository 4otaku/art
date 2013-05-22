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
	need_full_reload: true,
	data: {},
	data_id: 0,
	api: '',
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
		if (this.need_full_reload) {
			if (data.parent) {
				var href = document.location.href;
				href = href.replace(/\bparent=\d+\b/, 'parent=' + data.parent);
				document.location.assign(href);
			} else {
				document.location.reload();
			}
		} else {
			this.message('art_reload', function(){
				this.el.hide();
			}, this);
		}
	},
	on_load_failure: function() {
		this.child.loader.hide();
		this.child.error.html(this.errors.unexpected).show();
	},
	on_save_failure: function(data) {
		this.child.loader.hide();
		this.child.save_wrapper.show();
		this.child.error.html(Ajax.translate_error(data.errors[0])).show();
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
			if (this.api) {
				this.message('edit_cancel');
			}

			this.el.show();
			this.child.form.hide();
			this.child.save_wrapper.hide();
			this.child.save.show();
			this.child.save.addClass('disabled');
			this.child.loader.show();
			this.child.error.hide();
			this.child.success.hide();

			this.data = {};
			this.data_id = id;
			this.api = (mode != 'art') && (type != 'tag') ? mode :
				mode + '_' + type;
			this.need_full_reload = (mode != 'art') ||
				(type == 'translation') || (type == 'variation') ||
				(type == 'approve');

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
		},
		edit_hide_save_button: function() {
			this.child.save.hide();
		},
		edit_do_save: function() {
			this.child.save.click();
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
	do_start: function() {
		this.message('edit_load', this.type,
			this.mode ? 'art_' + this.mode : 'art', this.id_item);
	},
	events: {
		init: function() {
			if (document.location.hash) {
				var target = document.location.hash.match(/^#do\-edit\-(.*)/);
				if (target && target[1] == this.type) {
					this.do_start();
				}
			}
		},
		click: function() {
			this.do_start();
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
	send_data: function() {
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
	},
	events: {
		init: function() {
			this.start_data = this.gather_data();
		},
		fields: {
			change: function() {
				this.send_data()
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
			keyup: function(e) {
				this.get_super().events.field.keyup.call(this, e);
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
		edit: '.edit',
		delete: '.delete',
		help: '.help',
		info: '.info',
		undo: '.undo',
		redo: '.redo'
	},
	set_mode: function(mode) {
		this.message('change_translation_mode', mode);
		this.child.edit.removeClass('active');
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
			send = {change: [], add: [], remove: []};
		$.each(data, function(id, data){
			var before = initial[id];

			if (data[5] && !data[6] && before) {
				send.remove.push(id);
				return;
			}

			if (data[6]) {
				send.add.push({x1: data[0], x2: data[1], y1: data[2],
					y2: data[3], text: data[4]});
				return;
			}

			var changed = false,
				item = {id: id};

			if (!before || before[0] != data[0]) {
				item.x1 = data[0];
				changed = true;
			}
			if (!before || before[1] != data[1]) {
				item.x2 = data[1];
				changed = true;
			}
			if (!before || before[2] != data[2]) {
				item.y1 = data[2];
				changed = true;
			}
			if (!before || before[3] != data[3]) {
				item.y2 = data[3];
				changed = true;
			}
			if (!before || before[4] != data[4]) {
				item.text = data[4];
				changed = true;
			}
			if (changed) {
				send.change.push(item);
			}
		});

		this.message('edit_data_change', send, send.change.length ||
			send.add.length || send.remove.length);
	},
	events: {
		init: function() {
			this.write_state(true);
			this.set_mode('edit');
		},
		edit: {
			click: function() {
				this.set_mode('edit');
			}
		},
		delete: {
			click: function() {
				this.set_mode('delete');
			}
		},
		help: {
			click: function() {
				if (this.child.help.is('.active')) {
					this.child.help.removeClass('active');
					this.child.info.hide();
				} else {
					this.child.help.addClass('active');
					this.child.info.show();
				}
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

OBJECT.edit_text = function(id, values, events) {
	OBJECT.edit_simple.call(this, id, values, events);

	this.child.field.wysibb(wbbconfig);
	this.inited = true;
	this.el.find('.wysibb').on('click keyup', $.proxy(this.send_data, this));
};

extend(OBJECT.edit_text, OBJECT.edit_simple, {
	class_name: 'edit_text',
	inited: false,
	child_config: {
		field: 'textarea'
	},
	gather_data: function() {
		if (this.inited) {
			this.child.field.sync();
		}
		return this.get_super().gather_data.call(this);
	},
	listen: {
		wysibb_change: function() {
			this.send_data();
		}
	}
});

OBJECT.edit_cover = function(id, values, events) {
	OBJECT.edit_simple.call(this, id, values, events);
};

extend(OBJECT.edit_cover, OBJECT.edit_simple, {
	class_name: 'edit_cover',
	events: {
		init: function() {
			this.get_super().events.init.call(this);
			this.message('mark_cover', this.child.fields.val());
		}
	},
	listen: {
		thumbnail_clicked: function(id) {
			this.child.fields.val(id);
			this.message('mark_cover', id);
			this.send_data();
		}
	}
});

OBJECT.edit_sort = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.edit_sort, OBJECT.base, {
	class_name: 'edit_sort',
	initial_order: [],
	order: [],
	send_data: function() {
		this.message('edit_data_change', {order: this.order},
			this.initial_order.toString() != this.order.toString());
	},
	events: {
		init: function() {
			this.message('thumbnail_sort');
		}
	},
	listen: {
		thumbnail_sort_init: function(data) {
			this.initial_order = data;
		},
		thumbnail_sort_stop: function(data) {
			this.order = data;
			this.send_data();
		}
	}
});

OBJECT.edit_remove = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.edit_remove, OBJECT.base, {
	class_name: 'edit_remove',
	remove: [],
	send_data: function() {
		this.message('edit_data_change', {remove: this.remove},
			this.remove.length);
	},
	listen: {
		thumbnail_clicked: function(id) {
			if (this.remove.indexOf(id) !== -1) {
				this.remove = $.grep(this.remove, function(value) {
					return value != id;
				});
				this.message('thumbnail_unremove', id);
			} else {
				this.remove.push(id);
				this.message('thumbnail_remove', id);
			}
			this.send_data();
		}
	}
});

OBJECT.edit_similar = function(id, values, events) {
	OBJECT.edit_sort.call(this, id, values, events);
};

extend(OBJECT.edit_similar, OBJECT.edit_remove, OBJECT.edit_sort.prototype);
mixin(OBJECT.edit_similar.prototype, {
	class_name: 'edit_similar',
	send_data: function() {
		var sorted = this.initial_order.toString() != this.order.toString();
		this.message('edit_data_change',
			{order: this.order, remove: this.remove},
			sorted || this.remove.length);
	}
});

OBJECT.edit_state = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.edit_state, OBJECT.base, {
	class_name: 'edit_state',
	confirm: false,
	events: {
		init: function() {
			this.message('edit_hide_save_button');
		},
		click: function() {
			if (this.confirm && !confirm(this.confirm)) {
				return;
			}
			this.message('edit_data_change', {state: 'state_' + this.id}, true);
			this.message('edit_do_save');
		}
	}
});

OBJECT.edit_image = function(id, values, events) {
	OBJECT.edit_simple.call(this, id, values, events);
};

extend(OBJECT.edit_image, OBJECT.edit_simple, {
	class_name: 'edit_image',
	child_config: {
		fields: '.value',
		start: '.start',
		error: '.error',
		loader: '.start img',
		upload: '.fileupload',
		thumb: '.image_thumbnail img'
	},
	events: {
		init: function() {
			var child = this.child;
			this.child.upload.fileupload({
				dataType: 'json',
				replaceFileInput: false,
				add: function (e, data) {
					data.context = child.start;
					child.error.hide();
					child.start.removeClass('disabled');
					child.start.unbind('click').click(function () {
						child.start.addClass('disabled');
						child.start.unbind('click');
						child.loader.show();
						data.submit();
					});
				},
				done: function (e, data) {
					var result = data.result[0];

					if (!result.upload_key) {
						child.error.html(Ajax.translate_error(result));
						if (Ajax.is_duplicate_error(result)) {
							child.error.append(' ' + Ajax.get_duplicate_link(result));
						}
						child.error.show();
					} else {
						child.thumb.show();
						child.thumb.attr('src', result.thumbnail_url);
						child.fields.val(result.upload_key);
						child.fields.change();
					}

					child.loader.hide();
					child.upload.val('');
				}
			});
		}
	}
});

OBJECT.vote = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.vote, OBJECT.base, {
	class_name: 'vote',
	disabled: false,
	approve: false,
	item: 0,
	events: {
		click: function(e) {
			e.preventDefault();
			if (this.disabled) {
				return;
			}

			Ajax.perform('/ajax/save/', {api: 'art_rating',
				data: {approve: this.approve, id: this.item}});

			this.message('vote_clicked', this.approve);
		}
	},
	listen: {
		vote_clicked: function(approve) {
			this.disabled = true;
			if (approve != this.approve) {
				this.el.hide();
			} else {
				this.el.addClass('vote_disabled');
				this.el.attr('title', 'Вы уже голосовали');
			}
		}
	}
});

