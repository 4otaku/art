OBJECT.image = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.image, OBJECT.base, {
	class_name: 'image',
	child_config: {
		img: 'img'
	},
	is_resized: 0,
	resized: '',
	full: '',
	full_width: 0,
	full_height: 0,
	full_object: null,
	resized_object: null,
	loading: false,
	adding_translation: false,
	last_translation_id: 0,
	message_size: function(width, height) {
		width = width || this.child.img.width();
		height = height || this.child.img.height();
		this.message('image_resized', this.id, width, height);
	},
	display_full: function() {
		if (this.full_object == null) {
			this.full_object = $('<img/>').attr('src', this.full);

			this.loading = true;
			this.el.css('position', 'relative');
			this.full_object.css({
				position: 'absolute',
				top: '0px',
				left: '0px',
				'z-index': 100
			});
			this.full_object.imagesLoaded($.proxy(this.on_full_load, this));
		}

		if (!this.loading) {
			this.child.img.replaceWith(this.full_object);
			this.child.img = this.full_object;
		} else {
			this.child.img.css('width', this.full_width);
			this.el.append(this.full_object);
		}
	},
	display_resized: function() {
		if (this.child.img.is(this.full_object)) {
			this.child.img.replaceWith(this.resized_object);
		} else {
			this.full_object.detach();
		}

		this.child.img = this.resized_object;
		this.child.img.css('width', 'auto');
	},
	on_full_load: function() {
		this.loading = false;

		this.full_object.css({
			position: 'static',
			top: 'auto',
			left: 'auto',
			'z-index': 1
		});

		if (this.child.img.is(this.resized_object)) {
			this.child.img.detach();
			this.child.img = this.full_object;
		}
	},
	add_translation: function(x, y) {
		var resize = this.child.img.width() / this.full_width;
		x = Math.round(x / resize);
		y = Math.round(y / resize);
		var size = Math.round(25 / resize);
		this.last_translation_id++;

		var insert = $('<div/>').addClass('art_translation').
			attr('id', 'translation_new_' + this.last_translation_id),
			handle = $('<div/>').addClass('handle'),
			box = $('<div/>').addClass('box').attr('id',
				'bb_new_' + this.last_translation_id + '_tr'),
			edit = $('<div/>').addClass('edit_translation')
				.append('<textarea/>');

		insert.append(handle).append(box).append(edit).insertAfter(this.el);
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
		tr.display(this.child.img.width());
		tr.start_drag();
	},
	events: {
		init: function() {
			this.resized_object = this.child.img;
			if (!this.is_resized) {
				this.full_object = this.child.img;
			}

			var resize_factor = this.is_resized ?
				Math.min(1, (750 / this.full_width)) : 1;
			this.message_size(this.full_width * resize_factor,
				this.full_height * resize_factor);
		},
		click: function(e) {
			if (!this.adding_translation) {
				this.message('image_clicked', this.id);
			} else {
				this.add_translation(e.pageX - this.el.offset().left,
					e.pageY - this.el.offset().top);
			}
		}
	},
	listen: {
		fullsize_clicked: function() {
			if (this.is_resized) {
				this.is_resized = 0;
				this.display_full();
			} else {
				this.is_resized = 1;
				this.display_resized();
			}
			this.message_size();
		},
		change_translation_mode: function(mode) {
			this.adding_translation = (mode == 'edit');
		}
	}
});
