OBJECT.translation = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	$(this.parent_selector).imagesLoaded($.proxy(this.on_load, this));
}

extend(OBJECT.translation, OBJECT.base, {
	class_name: 'translation',
	parent_selector: 'div.image img',
	resize_factor: 1,
	child_config: {
		box: '.box'
	},
	on_load: function() {
		console.log(13);
		this.current_width = $(this.parent_selector).width();
		this.resize_factor = this.current_width / this.width;

		this.el.css('top', this.get_val(this.y1));
		this.el.css('height', this.get_val(this.y2));
		this.el.css('left', this.get_val(this.x1));
		this.el.css('width', this.get_val(this.x2));
		this.el.show();
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
