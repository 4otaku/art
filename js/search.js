OBJECT.search = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.parse_area();
	this.val = this.get_val();
}

extend(OBJECT.search, OBJECT.base, {
	class_name: 'search',
	area: [],
	child_config: {
		area: '.search_boxes input',
		field: '.field .search',
		button: '.field .search-button',
		tip: '.field .search-tip'
	},
	parse_area: function() {
		var area = [];
		this.child.area.each(function() {
			if ($(this).is(':checked')) {
				area.push($(this).val());
			}
		});
		this.area = area;
	},
	get_val: function() {
		return this.child.field.val().replace(/\//g, ' ')
			.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
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
	perform_search: function(val, area) {
		document.location.href='/search/'+area.join(',')+
			'/'+this.get_sort(area)+'/'+encodeURI(val)+'/';
	},
	get_sort: function(area) {
		if (area.length == 1 && area[0] == 'art') {
			return 'art';
		}
		return 'rel';
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
		area: {
			click: function() {
				this.parse_area();
			}
		},
		field: {
			keyup: function() {
				var val = this.get_val();
				if (this.val != val && val.length > 0) {
					this.val = val;
					var area = this.area.join(',');
					Ajax.get('/ajax/search_tip', {area: area, val: val}, function(response) {
						if (response.success) {
							var tip_box = this.build_tip_box(response.data);
							if (response.query == this.val) {
								this.child.tip.empty().append(tip_box);
							}
						}
					}, this);
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
						var val = this.get_val();
						if (val.length > 2 && this.area.length > 0) {
							this.perform_search(val, this.area);
						}
						break;
					default: break;
				}
			}
		},
		button: {
			click: function() {
				var val = this.get_val();
				if (val.length < 3) {
					alert('В строке поиска должно быть больше двух символов.');
				} else if (this.area.length < 1) {
					alert('Задайте область поиска.');
				} else {
					this.perform_search(val, this.area);
				}
			}
		}
	}
});
