OBJECT.thumb = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.thumb, OBJECT.base, {
	class_name: 'thumb',
	child_config: {
		image: 'img'
	},
	events: {
		image: {
			click: function(e) {
				e.preventDefault();
				this.message('thumbnail_clicked', this.id);
			}
		}
	},
	listen: {
		mark_cover: function(id) {
			if (this.id == id) {
				this.el.addClass('thumbnail_chosen_cover');
			} else {
				this.el.removeClass('thumbnail_chosen_cover');
			}
		}
	}
});