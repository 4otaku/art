OBJECT.new_pool = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
	this.child.text.wysibb(wbbconfig);
}

extend(OBJECT.new_pool, OBJECT.base, {
	class_name: 'new_pool',
	sending: false,
	child_config: {
		title: '.title',
		text: '.text',
		create: '.create'
	},
	submodule_config: {
		tags: 'add_tags'
	},
	gather_data: function() {
		return {
			title: this.child.title.val(),
			text: this.child.text.bbcode() || '',
			tag: this.submodule.tags.get_terms()
		};
	},
	process_error: function(errors) {
		// Таким образом, потому что ошибка может произойти только в случае НЁХ
		Overlay.html('<h2>Неизвестная ошибка</h2>');
	},
	events: {
		title: {
			keyup: function() {
				if (this.child.title.val()) {
					this.child.create.removeClass('disabled');
				} else {
					this.child.create.addClass('disabled');
				}
			}
		},
		create: {
			click: function() {
				if (this.child.create.is('.disabled') || this.sending) {
					return;
				}
				this.sending = true;

				var data = this.gather_data();

				Ajax.api('create_art_' + this.pool_type, data, function(response) {
					this.sending = false;
					if (response.errors.length || !response.id) {
						this.process_error(response.errors);
						return;
					}

					document.location.href = '/add/?' + this.pool_type + '='
						+ response.id;
				}, this);
			}
		}
	}
});

OBJECT.new_group = function(id, values, events) {
	OBJECT.new_pool.call(this, id, values, events);
}

extend(OBJECT.new_group, OBJECT.new_pool, {
	class_name: 'new_group',
	pool_type: 'group'
});

OBJECT.new_manga = function(id, values, events) {
	OBJECT.new_pool.call(this, id, values, events);
}

extend(OBJECT.new_manga, OBJECT.new_pool, {
	class_name: 'new_manga',
	pool_type: 'manga'
});

OBJECT.new_pack = function(id, values, events) {
	OBJECT.new_pool.call(this, id, values, events);
}

extend(OBJECT.new_pack, OBJECT.new_pool, {
	class_name: 'new_pack',
	pool_type: 'pack'
});

