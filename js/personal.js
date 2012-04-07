OBJECT.personal_link = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	if (values.url) {
		this.child.link.attr('href', values.url);
	}

	if (values.name) {
		this.child.link.html(values.name);
	}
}

extend(OBJECT.personal_link, OBJECT.base, {
	class_name: 'personal_link',
	child_config: {
		edit: '.edit_private_item',
		link: '.link'
	}
});
