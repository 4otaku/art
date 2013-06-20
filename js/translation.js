OBJECT.translation = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.bbcode = this.submodule.box.get_original();

	if (this.is_new) {
		this.message('translation_change_end');
	}

	this.uid = Math.random(0, 1);
};

extend(OBJECT.translation, OBJECT.base, {
	class_name: 'translation',
	mode: 'view',
	is_new: false,
	deleted: false,
	edit_inited: false,
	editing: false,
	bbcode: false,
	id_image: 0,
	resize_factor: 1,
	current_width: 750,
	full_width: 750,
	x1: 0,
	x2: 0,
	y1: 0,
	y2: 0,
	submodule_config: {
		box: {
			type: 'bb',
			postfix: '_tr'
		}
	},
	child_config: {
		edit: '.edit_translation',
		editfield: '.edit_translation textarea'
	},
	get_val: function(val, reverse) {
		return reverse ? Math.round(val / this.resize_factor) :
			Math.round(val * this.resize_factor);
	},
	display: function(width) {
		if (this.deleted) {
			this.el.hide();
			return;
		}

		if (width) {
			this.current_width = width;
		}
		this.resize_factor = this.current_width / this.full_width;

		this.el.css('top', this.get_val(this.y1));
		this.el.css('height', this.get_val(this.y2));
		this.el.css('left', this.get_val(this.x1));
		this.el.css('width', this.get_val(this.x2));
		this.el.show();
	},
	start_edit: function() {
		this.message('translation_edit_start', this.id);
		this.message('translation_change_start');
		if (this.editing) {
			this.child.edit.show();
			return;
		}

		this.editing = true;

		this.submodule.box.el.hide();
		this.child.edit.show();
		if (!this.edit_inited) {
			this.edit_inited = true;
			var left = this.el.offset().left,
				right = left + this.el.outerWidth(),
				view_width = $(window).width() + $(window).scrollLeft();
			if (view_width - right < 300) {
				this.child.edit.css('right', '-' + (view_width - right - 10) + 'px');
			}
			this.child.editfield.wysibb(wbbtranslationconfig);
		}
		var html = this.submodule.box.translate(this.bbcode);
		this.child.editfield.bbcode(this.bbcode);
		this.child.editfield.htmlcode(html);
	},
	finish_edit: function(discard) {
		if (!discard && this.edit_inited) {
			var bbcode = this.child.editfield.bbcode();
			if (bbcode != this.bbcode) {
				this.bbcode = bbcode;
				this.submodule.box.el.html(this.child.editfield.htmlcode());
				this.message('translation_change_end');
			}
		}
		this.child.edit.hide();
		this.editing = false;
	},
	on_move_start: function() {
		this.message('translation_change_start');
	},
	on_move_stop: function(e, ui) {
		this.x1 = this.get_val(ui.position.left, true);
		this.y1 = this.get_val(ui.position.top, true);

		if (ui.size) {
			this.x2 = this.get_val(ui.size.width, true);
			this.y2 = this.get_val(ui.size.height, true);
		}

		this.message('translation_change_end');
	},
	start_drag: function() {
		this.el.draggable({
			containment: 'parent',
			handle: '.handle',
			start: $.proxy(this.on_move_start, this),
			stop: $.proxy(this.on_move_stop, this)
		});
		this.el.resizable({
			containment: 'parent',
			handle: '.handle',
			minHeight: 20,
			minWidth: 20,
			start: $.proxy(this.on_move_start, this),
			stop: $.proxy(this.on_move_stop, this)
		});
	},
	events: {
		mouseenter: function(e) {
			this.submodule.box.el.show();
		},
		mouseleave: function(e) {
			this.submodule.box.el.hide();
		},
		dblclick: function(e) {
			if (this.mode == 'delete') {
				this.deleted = true;
				this.display();
				this.message('translation_change_end');
			} else if (this.mode == 'edit') {
				this.start_edit();
			}
		}
	},
	listen: {
		image_clicked: function(id) {
			if (this.id_image == id && this.mode == 'view') {
				this.el.toggle();
			}
		},
		image_resized: function(id, width) {
			if (this.id_image != id) {
				return;
			}

			this.display(width);
		},
		change_translation_mode: function(mode) {
			if (!this.deleted) {
				this.el.show();
				this.finish_edit();
			}

			this.mode = mode;

			if (this.el.is('.ui-draggable')) {
				this.el.draggable('destroy');
				this.el.resizable('destroy');
			}

			if (mode == 'edit') {
				this.start_drag();
			}
		},
		translation_edit_start: function(id) {
			if (this.editing && this.id != id) {
				this.finish_edit();
			}
		},
		translation_edit_save: function(editfield) {
			if (!editfield || this.child.editfield.is(editfield)) {
				this.finish_edit();
			}
		},
		translation_state_report: function() {
			this.message('translation_state', this.id, [this.x1, this.x2,
				this.y1, this.y2, this.bbcode, this.deleted, this.is_new
			]);
		},
		translation_state_set: function(state) {
			if (!state[this.id]) {
				this.deleted = true;
			} else {
				state = state[this.id];
				this.x1 = state[0];
				this.x2 = state[1];
				this.y1 = state[2];
				this.y2 = state[3];
				this.bbcode = state[4];
				this.deleted = state[5];

				this.submodule.box.el.html(
					this.submodule.box.translate(this.bbcode));
			}

			this.display();
			this.finish_edit(true);
		}
	}
});