OBJECT.image = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.el.imagesLoaded($.proxy(this.message_width, this));
};

extend(OBJECT.image, OBJECT.base, {
	class_name: 'image',
	is_resized: 0,
	resized: '',
	full: '',
	listen: {
		fullsize_clicked: function() {
			if (this.is_resized) {
				this.is_resized = 0;
				this.el.attr('src', this.full);
			} else {
				this.is_resized = 1;
				this.el.attr('src', this.resized);
			}
		}
	},
	message_width: function() {
		this.message('image_resized', this.id, this.el.width());
	},
	events: {
		click: function(e) {
			this.message('image_clicked');
		},
		resize: function() {
			this.message_width();
		}
	}
});
