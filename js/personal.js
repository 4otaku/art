OBJECT.personal_link = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	if (this.url) {
		this.child.link.attr('href', this.url);
	} else {
		this.url = this.child.link.attr('href');
	}

	if (this.name) {
		this.child.link.html(this.name);
	} else {
		this.name = this.child.link.html();
	}
}

extend(OBJECT.personal_link, OBJECT.base, {
	class_name: 'personal_link',
	child_config: {
		edit: '.edit_private_item',
		link: '.link'
	},
	events: {
		edit: {
			click: function() {
				console.log(this);
				Overlay.ajax('/ajax/menu_edit?id=' + this.id);
			}
		}
	}
});
