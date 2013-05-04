OBJECT.image = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.el.imagesLoaded($.proxy(this.message_width, this));
};

extend(OBJECT.image, OBJECT.base, {
	class_name: 'image',
	is_resized: 0,
	resized: '',
	full: '',
	full_width: 0,
	adding_translation: false,
	last_translation_id: 0,
	message_width: function() {
		this.message('image_resized', this.id, this.el.width());
	},
	add_translation: function(x, y) {
		var resize = this.el.width() / this.full_width;
		x = Math.round(x / resize);
		y = Math.round(y / resize);
		var size = Math.round(25 / resize);
		this.last_translation_id++;

		var insert = $('<div/>').addClass('art_translation').
			attr('id', 'translation_new_' + this.last_translation_id),
			box = $('<div/>').addClass('box').attr('id',
				'bb_new_' + this.last_translation_id + '_tr'),
			edit = $('<div/>').addClass('edit_translation')
				.append('<textarea/>');

		insert.append(box).append(edit).insertAfter(this.el);
		var tr = init('translation', 'new_' + this.last_translation_id, {
			full_width: this.full_width,
			is_new: true,
			mode: 'edit',
			id_image: this.id,
			x1: x - size,
			y1: y - size,
			x2: size * 2,
			y2: size * 2
		});
		tr.display(this.el.width());
		tr.start_edit();
	},
	events: {
		click: function(e) {
			if (!this.adding_translation) {
				this.message('image_clicked', this.id);
			} else {
				this.add_translation(e.pageX - this.el.offset().left,
					e.pageY - this.el.offset().top);
			}
		},
		resize: function() {
			this.message_width();
		}
	},
	listen: {
		fullsize_clicked: function() {
			if (this.is_resized) {
				this.is_resized = 0;
				this.el.attr('src', this.full);
			} else {
				this.is_resized = 1;
				this.el.attr('src', this.resized);
			}
		},
		change_translation_mode: function(mode) {
			this.adding_translation = (mode == 'add');
		}
	}
});
