OBJECT.search = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
}

extend(OBJECT.search, OBJECT.base, {
	class_name: 'search',
	child_config: {
		area: '.search_boxes input',
		field: '.field .search',
		button: '.field .search-button',
		tip: '.field .search-tip'
	},
	events: {

	}
});
