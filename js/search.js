OBJECT.search = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.terms = this.get_terms();
}

extend(OBJECT.search, OBJECT.base, {
	class_name: 'search',
	current_tip_request: '',
	child_config: {
		field: '.input-append input',
		button: '.input-append button',
		tip: '.field .search-tip'
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
		var items = {};
		$.each(terms, function(key, term){
			var sep_position = term.indexOf(':', 1);
			if (sep_position === -1 || sep_position == term.length - 1) {
				var type = 'tag';
			} else {
				var type = term.slice(0, sep_position);
				term = term.slice(sep_position + 1, term.length);
			}
			if (!items[type]) {
				items[type] = [];
			}
			items[type].push(term);
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
	build_tip_box: function(queries) {
		var ret = $('<div/>').addClass('searchbox').addClass('mini-shell'),
			me = this;
		$.each(queries, function(key, query) {
			var text = query.query.length < me.max_tip_length ?
				query.query : (query.query.substring(0, me.max_tip_length) + ' ...');
			var el = $('<div/>').addClass('search-tip');
			var link = $('<a/>').click(function(e){
				e.preventDefault();
				if($(this).data("type") == 'search') {
					me.child.field.val($(this).data("alias"));
					me.child.button.click();
				}
				else {
					document.location.href = $(this).data("alias");
				}
			}).attr('href', '#').html(text).data(query).appendTo(el);
			ret.append(el);
		});
		return ret;
	},
	events: {
		field: {
			keyup: function() {
				var term = this.get_current();
				if (term.length == 0) {
					this.current_tip_request = '';
					return;
				}

				var sep_position = term.indexOf(':', 1);
				if (sep_position === -1 || sep_position == term.length - 1) {
					term = term.replace(/^!/, '');
					if (this.current_tip_request != term) {
						this.current_tip_request = term;
						Ajax.get('/ajax/search_tip', {term: term}, function(response) {
							console.log(response);
							if (response.success) {
								/*
								var tip_box = this.build_tip_box(response.data);
								if (response.query == this.val) {
									this.child.tip.empty().append(tip_box);
								}*/
							}
						}, this);
					}
				} else {

				}
			},
			keydown: function(e) {
				switch (e.which) {
					case 40: this.move_tip(1);  break;
					case 38: this.move_tip(-1);  break;
					case 13:
						var selected_tip = this.child.tip.find('.active');
						if (selected_tip.length) {
							selected_tip.children('a').click();
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
