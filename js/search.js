OBJECT.search = function(id, values, events) {
	OBJECT.ajax_tip.call(this, id, values, events);
};

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
		id: [],
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
		var type = 'tag';
		if (sep_position !== -1) {
			type = term.slice(0, sep_position);
			var test = type.replace(/^\-/, '');
			if (typeof this.query_language[test] == 'undefined') {
				type = 'tag';
			} else {
				term = term.slice(sep_position + 1, term.length);
			}
		}

		if (type == 'tag' && term.match(/^\-/, '')) {
			type = '-tag';
			term = term.slice(1, term.length);
		}
		return {type: type, name: term};
	},
	build_uri: function(terms) {
		var items = {};

		$.each(terms, $.proxy(function(key, term){
			if (term.length) {
				var data = this.parse_term(term);
				if (!items[data.type]) {
					items[data.type] = [];
				}
				items[data.type].push(data.name);
			}
		}, this));
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
		return parts.join('&');
	},
	perform_search: function(terms) {
		document.location.href = '/?' + this.build_uri(terms);
	},
	get_base_data: function(term, append_from) {
		var data = [];
		$.each(this.query_language, function(query_term, values) {
			if (query_term.indexOf(term) == 0) {
				data.push({
					name: query_term,
					cls: 'search-language',
					postfix: ':',
					append_from: append_from
				});
			}
		});
		return data;
	},
	get_term: function(term) {
		var match = this.child.field.val().match(
			new RegExp('\\b'+term+':(\\d+)'));
		return match ? match[1] : false;
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
				if (term.length == 0 && term == '-') {
					this.current_tip_request = '';
					this.child.tip.empty();
					return;
				}

				var data = this.parse_term(term);
				var type = data.type.replace(/^\-/, '');
				if (type == 'tag') {
					var negation = data.type.match(/^\-/) ?
						data.type.match(/^\-/)[0] : false;
					this.do_request(data.name, negation);
				} else {
					var vals = this.query_language[type] || [];

					var tags = [];
					$.each(vals, function(key, variant) {
						if (variant.indexOf(data.name) == 0) {
							tags.push({
								name: variant,
								cls: 'search-language',
								append_from: ':'
							});
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
