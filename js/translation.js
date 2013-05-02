OBJECT.translation = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.bbcode = this.submodule.box.get_original();
};

extend(OBJECT.translation, OBJECT.base, {
	class_name: 'translation',
	state: 'view',
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
	get_val: function(val) {
		return Math.round(val * this.resize_factor);
	},
	start_edit: function() {
		this.message('translation_edit_start', this.id);
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
	on_move_stop: function(e, ui) {
		console.log(ui);
		console.log(this);
	},
	events: {
		mouseenter: function(e) {
			if (this.state != 'move') {
				this.submodule.box.el.show();
			}
		},
		mouseleave: function(e) {
			this.submodule.box.el.hide();
		},
		click: function(e) {
			if (this.state == 'delete') {
				this.el.hide();
			} else if (this.state == 'edit') {
				this.start_edit();
			}
		}
	},
	listen: {
		image_clicked: function() {
			if (this.state == 'view') {
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
		change_translation_state: function(state) {
			this.el.show();

			this.state = state;

			if (this.el.is('.ui-draggable')) {
				this.el.draggable('destroy');
				this.el.resizable('destroy');
			}

			if (state == 'move') {
				this.el.draggable({
					containment: 'parent',
					stop: $.proxy(this.on_move_stop, this)
				});
				this.el.resizable({
					containment: 'parent',
					minHeight: 20,
					minWidth: 20,
					stop: $.proxy(this.on_move_stop, this)
				});
			}
		},
		translation_edit_start: function(id) {
			if (this.id != id) {
				this.child.edit.hide();
				this.editing = false;
			}
		}
	}
});