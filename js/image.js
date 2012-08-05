OBJECT.image = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.el.imagesLoaded($.proxy(this.on_load, this));
}

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
			this.el.imagesLoaded($.proxy(this.on_load, this));
		}
	},
	on_load: function() {
		this.message('image_resized', this.el.width());
	},
	events: {
		click: function(e) {
			this.message('image_clicked');
		}
	}
});
