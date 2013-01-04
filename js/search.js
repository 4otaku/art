OBJECT.search = function(id, values, events) {
	OBJECT.ajax_tip.call(this, id, values, events);
}

extend(OBJECT.search, OBJECT.ajax_tip, {
	class_name: 'search',
	address: 'tip_tag',
	query_language: {
		rating: [],
		width: [],
		height: [],
		weight: [],
		date: [],
		user: [],
		translator: [],
		translation_date: [],
		tag_count: [],
		comment_count: [],
		comment_date: [],
		pack: [],
		group: [],
		artist: [],
		manga: [],
		md5: [],
		parent: [],
		sort: ['none', 'random', 'date', 'width', 'height', 'weight', 'size',
			'rating', 'parent_order', 'comment_count', 'comment_date',
			'tag_count', 'translation_date'],
		order: ['desc', 'asc'],
		mode: ['art', 'comment', 'translation', 'pack', 'group', 'manga', 'artist'],
		page: [],
		per_page: [],
		approved: ['yes', 'no', 'waiting', 'all'],
		tagged: ['yes', 'no', 'all'],
		variations: ['yes', 'no']
	},
	child_config: {
		field: '.input-append input',
		button: '.input-append button',
		tip: '.tips'
	},
	parse_term: function(term) {
		var sep_position = term.indexOf(':', 1);
		if (sep_position === -1) {
			var type = 'tag';
		} else {
			var type = term.slice(0, sep_position);
			if (typeof this.query_language[type] == 'undefined') {
				var type = 'tag';
			} else {
				term = term.slice(sep_position + 1, term.length);
			}
		}
		return {type: type, name: term};
	},
	perform_search: function(terms) {
		var me = this;
		var items = {};

		$.each(terms, function(key, term){
			if (term.length) {
				var data = me.parse_term(term);
				if (!items[data.type]) {
					items[data.type] = [];
				}
				items[data.type].push(data.name);
			}
		});
		var parts = [];
		$.each(items, function(type, item){
			$.each(item, function(key, part){
				if (item.length == 1) {
					parts.push(type + '=' + part);
				} else {
					parts.push(type + '[]=' + part);
				}
			});
		});
		var uri = parts.join('&');
		document.location.href = '/?' + uri;
	},
	get_base_data: function(term) {
		var data = [];
		$.each(this.query_language, function(query_term, values) {
			if (query_term.indexOf(term) == 0) {
				data.push({name: query_term, cls: 'search-language', postfix: ':'});
			}
		});
		return data;
	},
	on_enter: function(selected) {
		if (selected.length) {
			selected.click();
			return;
		}
		this.child.button.click();
	},
	events: {
		field: {
			keyup: function(e) {
				if (e.which == 40 || e.which == 38 || e.which == 13) {
					return;
				}

				var term = this.get_current();
				if (term.length == 0) {
					this.current_tip_request = '';
					return;
				}

				var data = this.parse_term(term);
				if (data.type == 'tag') {
					term = data.name.replace(/^!/, '');
					this.do_request(term);
				} else {
					var vals = this.query_language[data.type] || [];

					var tags = [];
					$.each(vals, function(key, variant) {
						if (variant.indexOf(data.name) == 0) {
							tags.push({name: variant, cls: 'search-language', append_from: ':'});
						}
					});

					var tip_box = this.build_tip_box(tags);
					this.child.tip.empty().append(tip_box);
					this.on_outside_click(this.el, function(){
						this.child.tip.empty();
					});
				}
			}
		},
		button: {
			click: function() {
				var terms = this.get_terms();
				if (terms.length > 0) {
					this.perform_search(terms);
				}
			}
		}
	}
});
