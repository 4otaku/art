OBJECT.comment = function(id, values, events) {

	OBJECT.base.call(this, id, values, events);

	if (this.parent_load && this.parent > 0) {
		this.child.load.show();
	}

	setTimeout($.proxy(function() {
		this.load_parent(false);
	}, this), this.preload_order * 5000);
}

extend(OBJECT.comment, OBJECT.base, {
	class_name: 'comment',
	parent_load: false,
	parent: 0,
	parent_data: null,
	preload_order: 1,
	load_parent: function(show) {
		if (this.parent == 0) {
			return;
		}

		if (this.parent_data) {
			if (show) {

			}
			return;
		}

		Ajax.get('/ajax/comment', {
			id: this.parent
		}, function(result){
			if (show) {

			} else {
				console.log(result);
			}
		}, this);
	},
	child_config: {
		reply: '.comment-reply',
		reply_link: '.comment-reply a',
		load: '.comment-load-parent',
		load_link: '.comment-load-parent a'
	},
	events: {
		reply_link: {
			click: function(e) {
				e.preventDefault();
				this.child.reply_link.hide();
				this.message('reply_clicked', this.child.reply);
			}
		}
	}
});

OBJECT.comment_form = function(id, values, events) {

	OBJECT.form.call(this, id, values, events);

	this.child.text.wysibb({
		debug: false,
		smileAutoDetect: false,
		themeName: false,
		validTags: ['a','b','i','s','img','strike'],
		buttons: 'bold,italic,strike,|,fontsizeselect,fontcolor,|,link,img,|,spoiler',
		smileList: []
	});
}

extend(OBJECT.comment_form, OBJECT.form, {
	class_name: 'comment_form',
	child_config: {
		text: '.comment_text',
		field: '.comment_field',
		noreply_link: '.comment_noreply a'
	},
	events: {
		noreply_link: {
			click: function(e) {
				e.preventDefault();
				this.child.noreply_link.hide();
				this.child.field.prependTo(this.el);
			}
		}
	},
	listen: {
		reply_clicked: function(object) {
			this.child.noreply_link.show();
			this.child.field.prependTo(object);
		}
	}
});
