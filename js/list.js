OBJECT.list = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.list, OBJECT.base, {
	class_name: 'list',
	child_config: {
		thumbs: '.image_thumbnail'
	},
	inited: false,
	get_data: function() {
		var data = [];
		this.child.thumbs.each(function(){
			data.push({key: $(this).index(),
				id: $(this).attr('id').replace(/[^\d]/gi, '')});
		});
		data.sort(function(a, b){ return a.key > b.key; });
		for (var i in data) {
			data[i] = data[i].id;
		}
		return data;
	},
	on_sort_stop: function() {
		this.message('thumbnail_sort_stop', this.get_data());
	},
	events: {
		init: function() {
			this.el.find('script').remove();
		}
	},
	listen: {
		edit_cancel: function() {
			if (this.inited) {
				this.el.sortable('destroy');
				this.inited = false;
			}
		},
		thumbnail_sort: function() {
			this.message('thumbnail_sort_init', this.get_data());
			this.el.sortable({
				containment: "parent",
				stop: $.proxy(this.on_sort_stop, this)
			});
			this.inited = true;
		}
	}
});

OBJECT.thumb = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.thumb, OBJECT.base, {
	class_name: 'thumb',
	child_config: {
		image: 'img'
	},
	in_edit: false,
	events: {
		image: {
			click: function(e) {
				if (this.in_edit) {
					e.preventDefault();
					this.message('thumbnail_clicked', this.id);
				}
			}
		}
	},
	listen: {
		edit_load: function() {
			this.in_edit = true;
		},
		edit_save: function() {
			this.in_edit = false;
		},
		edit_cancel: function() {
			this.el.removeClass('thumbnail_chosen_cover');
			this.el.removeClass('thumbnail_removed');
			this.in_edit = false;
		},
		mark_cover: function(id) {
			if (this.id == id) {
				this.el.addClass('thumbnail_chosen_cover');
			} else {
				this.el.removeClass('thumbnail_chosen_cover');
			}
		},
		thumbnail_remove: function(id) {
			if (this.id == id) {
				this.el.addClass('thumbnail_removed');
			}
		},
		thumbnail_unremove: function(id) {
			if (this.id == id) {
				this.el.removeClass('thumbnail_removed');
			}
		}
	}
});