OBJECT.translation = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.translation, OBJECT.base, {
	class_name: 'translation',
	state: 'view',
	edit_inited: false,
	id_image: 0,
	resize_factor: 1,
	current_width: 750,
	full_width: 750,
	x1: 0,
	x2: 0,
	y1: 0,
	y2: 0,
	child_config: {
		box: '.box',
		edit: 'textarea'
	},
	get_val: function(val) {
		return Math.round(val * this.resize_factor);
	},
	start_edit: function() {
		this.child.box.hide();
		this.child.edit.show();
		if (!this.edit_inited) {
			this.edit_inited = true;
			this.child.edit.wysibb(wbbconfig);
		}
	},
	on_move_stop: function(e, ui) {
		console.log(ui);
		console.log(this);
	},
	events: {
		mouseenter: function(e) {
			if (this.state != 'move') {
				this.child.box.show();
			}
		},
		mouseleave: function(e) {
			this.child.box.hide();
		},
		click: function(e) {
			if (this.state == 'delete') {
				this.el.hide();
			}
		}
	},
	listen: {
		image_clicked: function() {
			this.el.toggle();
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
		}
	}
});