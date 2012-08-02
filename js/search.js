OBJECT.search = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.terms = this.get_terms();
}

extend(OBJECT.search, OBJECT.base, {
	class_name: 'search',
	current_tip_request: '',
	max_tip_length: 30,
	query_language: {
		rating: [],
		width: [],
		height: [],
		weight: [],
		date: [],
		user: [],
		pack: [],
		group: [],
		artist: [],
		manga: [],
		md5: [],
		parent: [],
		sort: ['none', 'random', 'date', 'width', 'height', 'weight', 'size',
			'rating', 'parent_order', 'comment_count', 'comment_date', 'tag_count'],
		order: ['desc', 'asc'],
		mode: ['art', 'comment', 'pack', 'group', 'manga', 'artist'],
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
	get_terms: function() {
		return this.child.field.val().replace(/^\s\s*/, '')
			.replace(/\s\s*$/, '').split(/\s\s*/);
	},
	get_current: function() {
		var pos = this.child.field.caret().start || 0;
		var terms = this.child.field.val().slice(0, pos).split(/\s\s*/);
		return terms[terms.length - 1];
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
		return {type: type, term: term};
	},
	move_tip: function(move) {
		var position = this.child.tip.find('.active').index();
		position = position + move;
		this.child.tip.find('.active').removeClass('active');
		if (position >= 0) {
			var el = this.child.tip.find('.searchbox div').get(position);
			if (el) {
				$(el).addClass('active');
			}
		}
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
				items[data.type].push(data.term);
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
	build_tip_box: function(tags) {
		var ret = $('<div/>').addClass('searchbox'), me = this;
		$.each(tags, function(key, tag) {
			var text = tag.tag.length < me.max_tip_length ? tag.tag :
				(tag.tag.substring(0, me.max_tip_length) + ' ...');

			var el = $('<div/>').addClass('search-tip')
				.data('tag', tag.tag + tag.postfix);
			var link = $('<a/>').attr('href', '#').html(text).appendTo(el);
			if (tag.language) {
				el.addClass('search-language');
			}

			el.click(function(e){
				e.preventDefault();
				var val = me.child.field.val();
				var end = me.child.field.caret().start || 0;
				var start = val.slice(0, end).lastIndexOf(' ');
				if (start == 1 || start == -1) {
					start = 0;
				} else {
					start++;
				}
				if ($(this).is('.search-language') && val.slice(start, end).indexOf(':') != -1) {
					var start = val.slice(0, end).lastIndexOf(':') + 1;
				}
				me.child.field.val(val.slice(0, start) + $(this).data('tag') +
					val.slice(end, val.length)).caretTo(start + $(this).data('tag').length);
				me.child.tip.empty();
				me.current_tip_request = '';
			});

			ret.append(el);
		});

		if (tags.length) {
			ret.addClass('mini-shell');
		}

		return ret;
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
					term = data.term.replace(/^!/, '');
					if (term.length && this.current_tip_request != term) {
						this.current_tip_request = term;
						Ajax.get('/ajax/search_tip', {term: term}, function(response) {
							if (response.success && response.query == this.current_tip_request) {
								var tags = [];

								$.each(this.query_language, function(query_term, values) {
									if (query_term.indexOf(term) == 0) {
										tags.push({tag: query_term, language: 1, postfix: ':'});
									}
								});
								$.each(response.tags, function(key, tag) {
									tags.push({tag: tag, language: 0, postfix: ' '});
								});

								var tip_box = this.build_tip_box(tags);
								this.child.tip.empty().append(tip_box);
							}
						}, this);
					}
				} else {
					var vals = this.query_language[data.type] || [];

					var tags = [];
					$.each(vals, function(key, variant) {
						if (variant.indexOf(data.term) == 0) {
							tags.push({tag: variant, language: 1, postfix: ' '});
						}
					});

					var tip_box = this.build_tip_box(tags);
					this.child.tip.empty().append(tip_box);
				}
			},
			keydown: function(e) {
				switch (e.which) {
					case 40: this.move_tip(1);  break;
					case 38: this.move_tip(-1);  break;
					case 13:
						var selected_tip = this.child.tip.find('.active');
						if (selected_tip.length) {
							selected_tip.click();
							return;
						}
						this.child.button.click();
						break;
					default: break;
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
