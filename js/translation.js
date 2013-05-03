OBJECT.translation = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.bbcode = this.submodule.box.get_original();
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
	on_move_start: function() {
		this.message('translation_change_start');
	},
	on_move_stop: function(e, ui) {
		var x1 = this.get_val(ui.position.left, true),
			y1 = this.get_val(ui.position.top, true),
			x2 = x1 + this.x2 - this.x1,
			y2 = y1 + this.y2 - this.y1;
		if (ui.size) {
			x2 = x1 + this.get_val(ui.size.width, true);
			y2 = y1 + this.get_val(ui.size.height, true);
		}
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;

		this.message('translation_change_end');
	},
	events: {
		mouseenter: function(e) {
			if (this.mode != 'move') {
				this.submodule.box.el.show();
			}
		},
		mouseleave: function(e) {
			this.submodule.box.el.hide();
		},
		click: function(e) {
			if (this.mode == 'delete') {
				this.deleted = true;
				this.el.hide();
				this.message('translation_change_end');
			} else if (this.mode == 'edit') {
				this.start_edit();
			}
		}
	},
	listen: {
		image_clicked: function() {
			if (this.id_image == id && this.mode == 'view') {
				this.el.toggle();
			}
		},
		image_resized: function(id, width) {
			if (this.id_image != id) {
				return;
			}

			this.current_width = width;
			this.resize_factor = this.current_width / this.full_width;

			this.el.css('top', this.get_val(this.y1));
			this.el.css('height', this.get_val(this.y2));
			this.el.css('left', this.get_val(this.x1));
			this.el.css('width', this.get_val(this.x2));
			this.el.show();
		},
		change_translation_mode: function(mode) {
			this.el.show();

			this.mode = mode;

			if (this.el.is('.ui-draggable')) {
				this.el.draggable('destroy');
				this.el.resizable('destroy');
			}

			if (mode == 'move') {
				this.el.draggable({
					containment: 'parent',
					start: $.proxy(this.on_move_start, this),
					stop: $.proxy(this.on_move_stop, this)
				});
				this.el.resizable({
					containment: 'parent',
					minHeight: 20,
					minWidth: 20,
					start: $.proxy(this.on_move_start, this),
					stop: $.proxy(this.on_move_stop, this)
				});
			}
		},
		translation_edit_start: function(id) {
			if (this.id != id) {
				this.child.edit.hide();
				this.editing = false;
			}
		},
		translation_state_report: function() {
			this.message('translation_state', this.id, [
				this.x1, this.x2, this.y1, this.y2, this.bbcode, this.deleted
			]);
		}
	}
});