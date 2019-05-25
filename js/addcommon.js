OBJECT.add_tags = function(id, values, events) {
	OBJECT.ajax_tip.call(this, id, values, events);

	this.child.field.css('overflow', 'hidden').autogrow();
}

extend(OBJECT.add_tags, OBJECT.ajax_tip, {
	class_name: 'add_tags',
	address: 'tip_tag',
	max_tip_length: 120,
	minimum_term_length: 0,
	child_config: {
		field: '.tags',
		tip: '.tips'
	},
	disable: function() {
		this.child.field.replaceWith($('<div/>').
			addClass('input-done').text(this.child.field.val()));
		this.child.tip.hide();
	},
	add_tags: function(tags) {
		var current = this.get_terms(),
			prepend = '';
		$.each(tags, $.proxy(function(key, tag){
			if (current.indexOf(tag) === -1) {
				prepend += tag + ' ';
			}
		}, this));

		if (prepend) {
			var val = this.child.field.val();
			var pos = this.child.field.caret().start || 0;
			this.child.field.val(prepend + val);
			if (this.child.field.is(':focus')) {
				this.child.field.caretTo(pos + prepend.length);
			}
		}
	}
});