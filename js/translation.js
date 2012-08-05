OBJECT.translation = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
}

extend(OBJECT.translation, OBJECT.base, {
	class_name: 'translation',
	resize_factor: 1,
	current_width: 750,
	full_width: 750,
	x1: 0,
	x2: 0,
	y1: 0,
	y2: 0,
	child_config: {
		box: '.box'
	},
	listen: {
		image_clicked: function() {
			this.el.toggle();
		},
		image_resized: function(width) {
			this.current_width = width;
			this.resize_factor = this.current_width / this.full_width;

			this.el.css('top', this.get_val(this.y1));
			this.el.css('height', this.get_val(this.y2));
			this.el.css('left', this.get_val(this.x1));
			this.el.css('width', this.get_val(this.x2));
			this.el.show();
		}
	},
	get_val: function(val) {
		return Math.round(val * this.resize_factor);
	},
	events: {
		mouseenter: function(e) {
			this.child.box.show();
		},
		mouseleave: function(e) {
			this.child.box.hide();
		}
	}
});
