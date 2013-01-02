OBJECT.ajaxtip = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.terms = this.get_terms();
}

extend(OBJECT.ajaxtip, OBJECT.base, {
	class_name: 'ajaxtip',
	address: '',
	current_tip_request: '',
	postfix: ' ',
	max_tip_length: 30,
	child_config: {
		field: '',
		tip: ''
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
			var el = this.child.tip.find('.tipbox div').get(position);
			if (el) {
				$(el).addClass('active');
			}
		}
	},
	build_tip_box: function(items) {
		var ret = $('<div/>').addClass('tipbox'), me = this;
		$.each(items, function(key, item) {
			item.postfix = item.postfix || me.postfix;

			var text = item.name.length < me.max_tip_length ? item.name :
				(item.name.substring(0, me.max_tip_length) + ' ...');

			var el = $('<div/>').addClass('ajax-tip')
				.data('term', item.name + item.postfix)
				.data('append_from', item.append_from || false);
			var link = $('<a/>').attr('href', '#').html(text).appendTo(el);
			if (item.cls) {
				el.addClass(item.cls);
			}

			el.click(function(e){
				e.preventDefault();
				me.on_tip_click($(this).data());
				me.child.tip.empty();
				me.current_tip_request = '';
			});

			ret.append(el);
		});

		if (items.length) {
			ret.addClass('mini-shell');
		}

		return ret;
	},
	on_tip_click: function(data){
		var val = this.child.field.val();
		var end = this.child.field.caret().start || 0;
		var start = val.slice(0, end).lastIndexOf(this.postfix);
		if (start == 1 || start == -1) {
			start = 0;
		} else {
			start++;
		}
		if (data.append_from) {
			var separator = data.append_from;
			if (val.slice(start, end).indexOf(separator) != -1) {
				start = val.slice(0, end).lastIndexOf(separator) + 1;
			}
		}
		this.child.field.val(val.slice(0, start) + data.term +
			val.slice(end, val.length)).caretTo(start + data.term.length);
	},
	do_request: function(term) {
		if (term.length && this.current_tip_request != term) {
			this.current_tip_request = term;
			Ajax.get('/ajax/' + this.address, {term: term}, function(response) {
				if (response.success && response.query == this.current_tip_request) {
					var data = this.get_base_data(term);

					$.each(response.data, function(key, item) {
						data.push(item);
					});

					var tip_box = this.build_tip_box(data);
					this.child.tip.empty().append(tip_box);
					this.on_outside_click(this.el, function(){
						this.child.tip.empty();
					});
				}
			}, this);
		}
	},
	get_base_data: function(term) {
		return [];
	},
	on_enter: function(selected) {
		if (selected.length) {
			selected.click();
		}
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

				this.do_request(term);
			},
			keydown: function(e) {
				switch (e.which) {
					case 40:
						this.move_tip(1);
						e.preventDefault();
						break;
					case 38:
						this.move_tip(-1);
						e.preventDefault();
						break;
					case 13:
						var selected_tip = this.child.tip.find('.active');
						this.on_enter(selected_tip);
						e.preventDefault();
						break;
					default: break;
				}
			}
		}
	}
});
