OBJECT.art_item = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.art_item, OBJECT.base, {
	class_name: 'art_item',
	child_config: {
		menu: '#reloadable_editmenu .sidebar_part',
		info: '#reloadable_info .sidebar_part',
		tags: '#reloadable_tags .sidebar_part',
		image: '#reloadable_image'
	},
	do_reload: function(callback) {
		$.each(this.child, function(name, el){
			var height = Math.round(el.height() / 2);
			var width = el.width();
			el.hide().html('<img src="/images/ajax-loader.gif" />')
				.addClass('reloading').css('height', (height + 15) + 'px')
				.css('padding-top', (height - 15) + 'px')
				.css('width', width + 'px').show();
		});
		var me = this;
		Ajax.load(document.location.href, function(data){
			data = $(data);
			console.log(data.find('script'));
			$.each(me.child, function(name, el){
				var selector = me.child_config[name];
				el.replaceWith(data.find(selector));
			});
			callback.call();
		}, function(data){
			document.location.reload();
		}, this);
	},
	listen: {
		art_reload: function(callback, scope) {
			this.do_reload(function(){
				callback.call(scope);
			});
		}
	}
});