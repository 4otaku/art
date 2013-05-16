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
	add_scripts: null,
	do_reload: function(callback) {
		var me = this;
		if (this.add_scripts === null) {
			this.add_scripts = '';
			$.each(this.child, function(name, el){
				el.find('script').each(function(){
					me.add_scripts += $(this).html();
				});
			});
		}

		$.each(this.child, function(name, el){
			var height = Math.round(el.height() / 2);
			var width = el.width();
			el.hide().html('<img src="/images/ajax-loader.gif" />')
				.addClass('reloading').css('height', (height + 15) + 'px')
				.css('padding-top', (height - 15) + 'px')
				.css('width', width + 'px').show();
		});
		Ajax.load(document.location.href, function(data){
			data = $(data);
			$.each(me.child, function(name, el){
				var selector = me.child_config[name];
				el.replaceWith(data.find(selector));
			});
			eval(me.add_scripts);
			init_objects();
			me.init_elements(me.id);
			callback.call();
		}, function(data){
			document.location.reload();
		}, this);
	},
	events: {
		init: function() {
			// Hide art query if working with item
			if (!window.history || !document.location.search) {
				return;
			}

			history.pushState(false, false, document.location.pathname
				+ document.location.hash);
		}
	},
	listen: {
		art_reload: function(callback, scope) {
			this.do_reload(function(){
				callback.call(scope);
			});
		}
	}
});

OBJECT.rating = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.rating, OBJECT.base, {
	class_name: 'rating',
	child_config: {
		number: '.rating_number'
	},
	listen: {
		vote_clicked: function(approve) {
			var val = parseInt(this.child.number.html()) + (approve ? 1 : -1);
			this.child.number.html(val);
		}
	}
});