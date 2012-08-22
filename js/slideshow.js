OBJECT.slideshow = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.init_plugin();
}

extend(OBJECT.slideshow, OBJECT.base, {
	class_name: 'slideshow',
	child_config: {
		list: 'ul'
	},
	plugin: null,
	load_page: 1,
	per_page: 10,
	load_images: function() {
		page = this.load_page;

		var query = '?page=' + page + '&per_page=' +
			this.per_page + '&' + this.query;

		Ajax.get('/ajax/art_list' + query, function(result){
			var position = (page - 1) * this.per_page;

			$.each(result, $.proxy(function(key, item){
				var image = '<img src="http://images.4otaku.ru/art/' + item.md5 +
					(item.resized != '0' ? '_resize.jpg' : '.' + item.ext) + '" />';
				this.plugin.add(position, image);
				position = position + 1;
				this.plugin.size(position);
			}, this));

			this.load_page = page + 1;
		}, this);
	},
	init_plugin: function() {
		this.child.list.jcarousel({
			itemLoadCallback: $.proxy(this.load_images, this),
			itemFallbackDimension: 150,
			scroll: 10
		});

		this.plugin = this.child.list.data('jcarousel');
	}
});
