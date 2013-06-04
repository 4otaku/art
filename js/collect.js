OBJECT.search_collect = function(id, values, events) {
	OBJECT.search.call(this, id, values, events);
};

extend(OBJECT.search_collect, OBJECT.search, {
	class_name: 'search_collect',
	actual_limit: 14,
	on_success: function(result) {
		this.message('collect_load_success', result.data,
			Math.ceil(result.count / this.get_per_page()), this.get_page());
	},
	get_page: function() {
		return this.get_term('page') || 1;
	},
	get_per_page: function() {
		return this.get_term('per_page') || this.actual_limit;
	},
	on_failure: function() {
		this.message('collect_load_failure');
	},
	perform_search: function(terms) {
		terms.push(this.mode + ':-' + this.val);
		terms.push('per_page:' + this.actual_limit);
		this.message('collect_load_start');
		Ajax.get('/ajax/art_json', this.build_uri(terms), this.on_success,
			this.on_failure, this);
	},
	listen: {
		search_value_parsed: function(id) {
			this.child.tip.empty();
			this.child.field.val('id:' + id);
			this.child.button.click();
		},
		collect_load_page: function(num) {
			if (this.get_term('page') == num) {
				return;
			}

			var val = this.child.field.val();
			if (val.match(/\bpage:[a-z\d]*/)) {
				val = val.replace(/\bpage:[a-z\d]*/, 'page:' + num);
			} else {
				val += ' page:' + num;
			}

			this.child.field.val(val);
			this.child.button.click();
		}
	}
});

OBJECT.link_parser = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.link_parser, OBJECT.base, {
	class_name: 'link_parser',
	child_config: {
		field: 'input',
		submit: 'button'
	},
	check_value: function() {
		if (this.parse_value()) {
			this.child.submit.removeClass('disabled');
		} else {
			this.child.submit.addClass('disabled');
		}
	},
	parse_value: function() {
		var value = this.child.field.val();
		if (value.match(/^\d+$/)) {
			return value;
		}

		value = value.split('?')[0];
		value = value.replace(/\/$/, '');
		value = value.split('/').reverse()[0];

		if (value.match(/^\d+$/)) {
			return value;
		}

		return false;
	},
	events: {
		init: function() {
			this.child.field.val('');
			this.check_value();
		},
		field: {
			change: function() {
				this.check_value();
			},
			keyup: function() {
				this.check_value();
			}
		},
		submit: {
			click: function() {
				var value = this.parse_value();

				if (!value || this.child.submit.is('.disabled')) {
					return;
				}

				this.message('search_value_parsed', value);
			}
		}
	}
});

OBJECT.art_list = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.art_list, OBJECT.base, {
	class_name: 'art_list',
	listen: {
		collect_load_start: function() {
			this.el.addClass('loader');
			this.el.removeClass('error');
			this.el.html('');
		},
		collect_load_failure: function() {
			this.el.removeClass('loader');
			this.el.addClass('error');
			this.el.html('Произошла ошибка при загрузке, попробуйте снова');
		},
		collect_load_success: function(data) {
			this.el.removeClass('loader');
			this.el.removeClass('error');
			this.el.html('');
			$.each(data, $.proxy(function(key, item){
				var img = $('<img/>').
					attr('src', this.base + item.md5 + '_thumb.jpg');
				var wrapper = $('<div/>').addClass('image_thumbnail')
					.data('id', item.id).addClass('small_thumbnail')
					.append(img);
				this.el.append(wrapper);
			}, this));
			var me = this;
			this.el.find('img').dblclick(function(e){
				me.message('collect_add', $(this).parent());
				e.preventDefault();
			});
		}
	}
});

OBJECT.art_paginator = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.art_paginator, OBJECT.base, {
	class_name: 'art_paginator',
	build: function(total, current) {
		var start = Math.max(current - 8, 2),
			end = Math.min(current + 9, total - 1);

		this.add('Страница ' + current + ' из ' + total);
		if (current > 1) {
			this.add('&lt;', current - 1);
		}
		this.add('1', 1, current == 1 ? 'active_page' : false);
		if (start > 2) {
			this.add('...', false, 'space');
		}
		if (end >= start) {
			for (var i = start; i <= end; i++) {
				this.add(i, i, current == i ? 'active_page' : false);
			}
		}
		if (end < total - 1) {
			this.add('...', false, 'space');
		}
		if (total > 1) {
			this.add(total, total, total == current ? 'active_page' :
				'first_last_page');
			if (total != current) {
				this.add('&gt;', current + 1);
			}
		}
	},
	add: function(text, page, cls) {
		var link = page ? $('<a/>').attr('href', '#' + page) : $('<span/>');
		link.html(text);
		var wrapper = $('<li/>').append(link);
		if (cls) {
			wrapper.addClass(cls);
		}
		this.el.append(wrapper);
	},
	listen: {
		collect_load_start: function() {
			this.el.html('');
		},
		collect_load_success: function(data, total, current) {
			this.el.html('');
			this.build(parseInt(total), parseInt(current));
			var me = this;
			this.el.find('a').click(function(e){
				me.message('collect_load_page',
					$(this).attr('href').replace('#', ''));
				e.preventDefault();
			});
		}
	}
});

OBJECT.collect_add = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.collect_add, OBJECT.base, {
	class_name: 'collect_add',
	added: [],
	saving: false,
	child_config: {
		list: '.collect_add',
		save: '.save',
		success: '.success',
		error: '.error'
	},
	on_save: function() {
		this.saving = false;
		this.added = [];
		this.child.list.html('');
		this.child.list.removeClass('loader');
		this.child.error.hide();
		this.child.success.show();
	},
	on_save_failure: function() {
		this.saving = false;
		this.child.list.children().show();
		this.child.list.removeClass('loader');
		this.child.error.show();
		this.child.success.hide();
	},
	events: {
		save: {
			click: function() {
				if (!this.added.length) {
					return;
				}

				this.saving = true;
				this.child.success.hide();
				this.child.error.hide();
				this.child.list.children().hide();
				this.child.list.addClass('loader');

				var added = [];
				$.each(this.added, function(key, value){
					added.push({id: value});
				});
				var data = {add: added, id: this.item};
				if (this.type != 'parent') {
					Ajax.perform('/ajax/save/',
						{data: data, api: 'art_' + this.type},
						this.on_save, this.on_save_failure, this);
				} else {
					Ajax.perform('/ajax/save/',
						{data: data, api: 'art_variation'},
						this.on_save, this.on_save_failure, this);
				}
			}
		}
	},
	listen: {
		collect_add: function(item) {
			if (this.saving) {
				return;
			}

			this.child.success.hide();
			this.child.error.hide();

			var me = this;
			if ($.inArray(item.data('id'), me.added) == -1) {
				var clone = item.clone();
				clone.appendTo(this.child.list);
				clone.data('id', item.data('id'));
				me.added.push(item.data('id'));
				clone.dblclick(function(){
					console.log(me.added);
					me.added = jQuery.grep(me.added, $.proxy(function(value) {
						return value != $(this).data('id');
					}, this));
					$(this).remove();
				});
			}
		}
	}
});