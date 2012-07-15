OBJECT.thumbnail = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.child.link.easyTooltip();
}

extend(OBJECT.thumbnail, OBJECT.base, {
	class_name: 'thumbnail',
	child_config: {
		link: 'a',
		image: 'img'
	}
});
