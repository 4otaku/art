OBJECT.art_item = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.art_item, OBJECT.base, {
	class_name: 'art_item',
	child_config: {
		scroll: '.scroll',
		reload: '.reloadable'
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

		this.child.reload.each(function(){
			var height = Math.round($(this).height() / 2);
			var width = $(this).width();
			$(this).triggerHandler('unbind_listeners');
			$(this).find('*').each(function(){
				$(this).triggerHandler('unbind_listeners');
			});
			$(this).hide().html('<img src="/images/ajax-loader.gif" />')
				.addClass('reloading').css('height', (height + 15) + 'px')
				.css('padding-top', (height - 15) + 'px')
				.css('width', width + 'px').show();
		});

		Ajax.load(document.location.href, function(data){
			data = $(data);
			me.child.reload.each(function(){
				// Shifting elements on one-by-one basis
				var selector = '.reloadable:eq(0)';
				$(this).replaceWith(data.find(selector));
			});
			eval(me.add_scripts);
			init_objects();
			me.init_elements(me.id);
			callback.call();
		}, function(data){
			document.location.href = document.location.pathname
				+ document.location.search;
		}, this);
	},
	events: {
		init: function() {
			// Hide art query if working with item
			if (!window.history || !document.location.search) {
				return;
			}

			var search = document.location.search.match(
				/comment_page=(\d+|all)/);
			search = search ? '?' + search[0] : '';

			history.replaceState(false, false, document.location.pathname
				+ search + document.location.hash);
		}
	},
	listen: {
		art_reload: function(callback, scope) {
			this.do_reload(function(){
				callback.call(scope);
			});
		},
		image_resized: function(id, width, height) {
			var top = Math.min(200, height - 120);

			if (top < 0) {
				this.child.scroll.css('top', 0);
				this.child.scroll.css('height', height + 'px');
			} else {
				this.child.scroll.css('top', top + 'px');
				this.child.scroll.css('height', 'auto');
			}

			this.child.scroll.show();
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