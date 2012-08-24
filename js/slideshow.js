OBJECT.slideshow = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.current = this.start;
	this.load_images();
}

extend(OBJECT.slideshow, OBJECT.base, {
	class_name: 'slideshow',
	query: null,
	per_page: 10,
	current: 1,
	from_page: null,
	to_page: null,
	load_images: function() {
		if (this.from_page === null || this.to_page === null) {
			var callback = this.insert_first;
			var page = Math.floor((this.current - 1) / this.per_page) + 1;
		} else {
			return;
		}

		var query = '?page=' + page + '&per_page=' +
			this.per_page + '&' + this.query;

		Ajax.load('/ajax/art_list' + query, function(result){
			callback.call(this, result, page);

			setTimeout($.proxy(function() {
				this.load_images();
			}, this), 3000);
		}, this);
	},
	insert_first: function(result, page) {
		$(this.el).html(result);
		this.from_page = page;
		this.to_page = page;
	}
});
