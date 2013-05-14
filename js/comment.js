OBJECT.comment = function(id, values, events) {

	OBJECT.base.call(this, id, values, events);

	if (this.parent_load && this.id_parent > 0) {
		this.create_parent();

		setTimeout($.proxy(function() {
			this.load_parent();
		}, this), this.preload_order * 10000 + Math.random(0, 10000));
	}
}

extend(OBJECT.comment, OBJECT.base, {
	class_name: 'comment',
	id_comment: 0,
	margin: 0,
	parent_load: false,
	parent_loaded: false,
	id_parent: 0,
	parent_obj: null,
	preload_order: 1,
	child_config: {
		bottom: '.comment-bottom',
		bottom_items: '.comment-bottom > *',
		reply_link: '.comment-reply a',
		bottom_separator: '.comment-bottom-separator',
		load: '.comment-load-parent',
		load_link: '.comment-load-parent a'
	},
	create_parent: function() {
		this.parent_obj = $('<div/>').addClass('comment-loading').hide();
		this.parent_obj.insertBefore(this.el);
	},
	load_parent: function() {
		if (this.parent_loaded) {
			return;
		}

		Ajax.load('/ajax/comment', {
			id_comment: this.id_parent
		}, function(result){
			var obj = $(result);

			if (!this.parent_obj.is(':visible')) {
				obj.hide();
			}
			this.parent_obj.replaceWith(obj);
			this.parent_obj = obj;
			this.parent_loaded = true;
		}, this);
	},
	move_margin: function() {
		this.margin = this.margin + 30;
		this.el.css('margin-left', this.margin);
		var next_id = this.el.nextAll('.comment').first().attr('id');
		console.log(next_id);
		console.log(this.id_comment);
		this.message('comment_moved', next_id, this.id_comment);
	},
	events: {
		reply_link: {
			click: function(e) {
				e.preventDefault();
				this.child.bottom_items.hide();
				this.message('reply_clicked', this.child.bottom);
			}
		},
		load_link: {
			click: function(e) {
				e.preventDefault();
				if (this.parent_obj) {
					this.parent_obj.show();
					this.move_margin();
					this.load_parent();
				}
				this.child.load.remove();
				this.child.bottom_separator.remove();
			}
		}
	},
	listen: {
		noreply_clicked: function() {
			this.child.bottom_items.show();
		},
		comment_moved: function(id_html, id_parent) {
			if (this.el.attr('id') == id_html &&
				this.id_parent == id_parent &&
				this.el.is(':visible')
			) {
				this.move_margin();
			}
		}
	}
});

OBJECT.comment_form = function(id, values, events) {
	OBJECT.form.call(this, id, values, events);
};

extend(OBJECT.comment_form, OBJECT.form, {
	class_name: 'comment_form',
	child_config: {
		text: '.comment_text',
		field: '.comment_field',
		name: '.comment_name',
		mail: '.comment_mail',
		noreply_link: '.comment_noreply'
	},
	url: '/ajax/save/',
	add_data: {
		api: 'comment',
		create: true
	},
	validate: {
		mail: Validate.email
	},
	events: {
		init: function() {
			this.child.text.wysibb(wbbconfig);
		},
		noreply_link: {
			click: function(e) {
				e.preventDefault();
				this.child.noreply_link.hide();
				this.child.field.prependTo(this.el);
				this.message('noreply_clicked');
			}
		}
	},
	listen: {
		reply_clicked: function(object) {
			this.child.noreply_link.show();
			this.child.field.prependTo(object);
		},
		comment_navi_used: function(object) {
			this.child.noreply_link.click();
		}
	}
});

OBJECT.comment_navi = function(id, values, events) {

	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.comment_navi, OBJECT.base, {
	class_name: 'comment_navi',
	target: '.comment-display',
	id_art: 0,
	child_config: {
		link: 'a'
	},
	events: {
		link: {
			click: function(e) {
				if (!window.history) {
					return;
				}
				this.message('comment_navi_used');

				var url = $(e.target).attr('href');
				var page_match = /&?comment_page=(\d+)/;
				var page_number = url.match(page_match);
				page_number = page_number ? page_number[1] : 1;

				history.pushState(false, false, url);

				var target = $(this.target);
				var height = Math.max(target.height(), 100);
				var loader = $('<div/>').addClass('comment-page-loading')
					.css('height', height);
				target.html(loader);

				url = url.replace(/^\/\d+/, '').replace(page_match, '');

				Ajax.load('/ajax/comment' + url, {
					id_art: this.id_art,
					comment_page: page_number
				}, function(result){
					$(this.target).replaceWith(result);
					document.getElementById('comments').scrollIntoView(true);
				}, this);

				e.preventDefault();
			}
		}
	}
});
