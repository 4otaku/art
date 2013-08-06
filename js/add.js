window.locale = {
	fileupload: {
		errors: {
			maxFileSize: Ajax.error[10],
			acceptFileTypes: Ajax.error[20],
			uploadedBytes: "Ошибка загрузки",
			emptyResult: "Сервер не отвечает",
			serverError: Ajax.error[540]
		}
	}
};

$(window).on('beforeunload', function(e) {
	if ($('.template-upload:not(.editing-disabled)').length) {
		return 'Вы действительно хотите покинуть эту страницу? ' +
			'Несохраненные арты будут потеряны.';
	}
});

OBJECT.upload = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	var me = this;
	this.el.fileupload({
		namespace: 'upload',
		maxFileSize: 20 * 1024 * 1024,
		acceptFileTypes: /(gif|jpeg|png|link)$/i,
		previewSourceMaxFileSize: 10 * 1024 * 1024,
		limitConcurrentUploads: 3,
		previewMaxWidth: 150,
		previewMaxHeight: 150,
		done: this.doneCallback,
		fail: this.failCallback,
		downloadTemplateId: null
	}).bind('fileuploadadded', function (e, data){
		init_objects();
	}).bind('fileuploaddrop fileuploaddragover', function (e, data){
		me.message('file_number_changed', 1);
	});

	this.el.data('object', this);
};

extend(OBJECT.upload, OBJECT.base, {
	class_name: 'upload',
	child_config: {
		start: 'button.start',
		add: 'button.add',
		remove: 'button.remove',
		link: 'button.link'
	},
	// Функция вынужденно скопирована почти целиком
	doneCallback: function (e, data) {
		var that = $(this).data('fileupload'),
	// Начало моего кода
			object = $(this).data('object');
	// Конец моего кода
		if (data.context) {
			data.context.each(function (index) {
				var file = ($.isArray(data.result) &&
					data.result[index]) || {error: 'emptyResult'};
				if (file.error) {
					that._adjustMaxNumberOfFiles(1);
				}
	// Начало моего кода
				object.message('upload_done',
					data.context.attr('id'), file);
	// Конец моего кода
			});
		} else {
			if ($.isArray(data.result)) {
				$.each(data.result, function (index, file) {
					if (data.maxNumberOfFilesAdjusted && file.error) {
						that._adjustMaxNumberOfFiles(1);
					} else if (!data.maxNumberOfFilesAdjusted &&
							!file.error) {
						that._adjustMaxNumberOfFiles(-1);
					}
				});
				data.maxNumberOfFilesAdjusted = true;
			}
	// Начало моего кода
			var template = that._renderUpload(data.result)
				.appendTo(that.options.filesContainer);
	// Конец моего кода
			that._forceReflow(template);
			that._transition(template).done(
				function () {
					data.context = $(this);
					that._trigger('completed', e, data);
				}
			);
		}
	},
	// Функция вынужденно скопирована почти целиком
	failCallback: function (e, data) {
		var that = $(this).data('fileupload'),
	// Начало моего кода
			object = $(this).data('object');
	// Конец моего кода
		if (data.maxNumberOfFilesAdjusted) {
			that._adjustMaxNumberOfFiles(data.files.length);
		}
		if (data.context) {
			data.context.each(function (index) {
				if (data.errorThrown !== 'abort') {
					var file = data.files[index];
					file.error = file.error || data.errorThrown ||
						true;
	// Начало моего кода
				object.message('upload_done',
					data.context.attr('id'), file);
	// Конец моего кода
				} else {
					that._transition($(this)).done(
						function () {
							$(this).remove();
							that._trigger('failed', e, data);
						}
					);
				}
			});
		} else if (data.errorThrown !== 'abort') {
			data.context = that._renderUpload(data.files)
				.appendTo(that.options.filesContainer)
				.data('data', data);
			that._forceReflow(data.context);
			that._transition(data.context).done(
				function () {
					data.context = $(this);
					that._trigger('failed', e, data);
				}
			);
		} else {
			that._trigger('failed', e, data);
		}
	},
	events: {
		add: {
			click: function(e) {
				e.preventDefault();
				this.message('add_all');
			}
		},
		remove: {
			click: function(e) {
				e.preventDefault();
				this.message('remove_all');
			}
		},
		link: {
			click: function() {
				Overlay.tpl('add_link');
			}
		}
	},
	listen: {
		file_number_changed: function(modificator){
			modificator = modificator || 0;
			var countAdd = $('.template-upload:not(.editing-disabled)').length;
			var countRemove = $('.template-upload.editing-disabled').length;

			if (countAdd + modificator > 1) {
				this.child.start.show();
				this.child.add.show();
			} else {
				this.child.start.hide();
				this.child.add.hide();
			}

			if (countRemove > 1) {
				this.child.remove.show();
			} else {
				this.child.remove.hide();
			}
		},
		link_added: function(link) {
			this.el.fileupload('add', {files:
				[new Blob([link], {type : "image\/link"})]});
		}
	}
});

OBJECT.add_link = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
};

extend(OBJECT.add_link, OBJECT.base, {
	class_name: 'add_link',
	child_config: {
		example: '.example',
		add: '.add',
		done: '.done'
	},
	events: {
		add: {
			click: function() {
				var insert = this.child.example.clone();
				insert.find('input').val('');
				var last = this.el.find('.example').last();
				insert.insertAfter(last);
			}
		},
		done: {
			click: function() {
				var link = this.el.find('.example input');
				var close = false;

				me = this;
				link.each(function(){
					if ($(this).val()) {
						me.message('link_added', $(this).val());
						close = true;
					}
				});

				if (close) {
					Overlay.close();
				}
			}
		}
	}
});

OBJECT.add = function(id, values, events) {
	this.message('file_number_changed');

	OBJECT.base.call(this, id, values, events);

	this.child.cancel.off(".upload");
	this.translate_size();
	this.child.name.html(
		this.fix_name_length(this.child.name.html()));

	if (this.child.error.is(':visible')) {
		this.disable_edit();
		this.child.data.hide();
		this.child.show_panel.hide();
		return;
	}

	if (Config.get('user', 'login')) {
		if (Config.get('user', 'gallery')) {
			this.child.with_gallery.find('a')
				.attr('href', '/?artist=' + Config.get('user', 'gallery'));
			this.child.with_gallery.show();
		} else {
			this.child.without_gallery.show();
		}
	} else {
		this.child.show_artist.attr('title', 'Чтобы добавить арт в свою галерею необходимо залогиниться.');
		this.child.show_artist.unbind('click').click(function(e){
			e.preventDefault();
		}).addClass('disabled');
	}
};

extend(OBJECT.add, OBJECT.base, {
	class_name: 'add',
	upload_key: false,
	uploaded: false,
	add_pending: false,
	add_callback: null,
	submodule_config: {
		tags: 'add_tags',
		groups: 'add_groups',
		packs: 'add_packs',
		manga: 'add_manga',
		comment: 'add_comment'
	},
	child_config: {
		preview: 'div.preview',
		name: 'div.name span',
		size: 'div.size span',
		add_wrapper: 'div.add',
		upload_wrapper: 'div.start',
		progress_wrapper: 'div.progress-bar',
		error_wrapper: 'div.error',
		error: 'div.error .label',
		upload: 'div.start button',
		add: 'div.add button',
		cancel: 'div.cancel button.delete',
		remove: 'div.cancel button.remove',
		data: 'div.data_active',
		source: 'div.data_active .source',
		hide: 'div.data_active .hide_data',
		show_panel: 'div.data_passive',
		show: 'div.data_passive .show_data',
		show_artist: 'div.data_passive .show_data.show_artist',
		artist: 'div.data_active .artist',
		with_gallery: 'div.data_active .artist .with_gallery',
		without_gallery: 'div.data_active .artist .without_gallery',
		approved: 'div.data_active .approved'
	},
	process_success: function(data) {
		this.upload_key = data.upload_key;

		this.child.preview.html('<img src="'+data.thumbnail_url+'" />');
		var name = this.fix_name_length(data.name);
		this.child.name.html('<a href="'+data.url+'" target="_blank">' +
			name + '</a>');
		this.translate_size();
		this.submodule.tags.add_tags(data.tags);
		this.child.upload_wrapper.html('&nbsp;');
		this.child.progress_wrapper.html('&nbsp;');
		this.child.progress_wrapper.addClass('progress-successful');

		if (this.add_pending) {
			this.do_add();
		}
	},
	process_error: function(data) {
		this.child.error.html(Ajax.translate_error(data));
		if (Ajax.is_duplicate_error(data)) {
			this.child.error_wrapper.append(Ajax.get_duplicate_link(data));
		}

		this.child.add_wrapper.html('&nbsp;');
		this.child.upload_wrapper.html('&nbsp;');
		this.child.progress_wrapper.hide();
		this.child.error_wrapper.show();

		this.disable_edit();
	},
	translate_size: function () {
		var size = this.child.size.html();
		size = size.replace('GB', 'Гб')
			.replace('MB', 'Мб').replace('KB', 'Кб');
		this.child.size.html(size);
	},
	disable_edit: function() {
		this.child.cancel.hide();
		this.child.remove.show();

		this.child.source.replaceWith($('<div/>').
			addClass('input-done').text(this.child.source.val()));
		this.submodule.tags.disable();
		this.submodule.groups.disable();
		this.submodule.packs.disable();
		this.submodule.manga.disable();
		this.submodule.comment.disable();
		this.child.data.find('button').hide();
		this.child.show_panel.hide();
		this.el.addClass('editing-disabled');

		if (this.add_callback) {
			this.add_callback.call(this);
		}

		this.message('file_number_changed');
	},
	fix_name_length: function(name) {
		this.submodule.packs.set_default_filename(name);

		if (name.length < 22) {
			return name;
		}

		var match = name.match(/\.[a-z\d]{1,5}$/i);
		var ext = match ? match[0] : '';
		var part_length = Math.floor((18 - ext.length) / 2);
		name = name.substr(0, name.length - ext.length);
		return name.substr(0, part_length) +
			'..' + name.substr(-1 * part_length) + ext;
	},
	do_add: function() {
		if (!this.uploaded) {
			this.add_pending = true;
			this.child.upload.click();
			return;
		}

		this.child.add.addClass('disabled').unbind('click').click(function(e){
			e.preventDefault();
		});
		this.child.cancel.addClass('disabled').unbind('click').click(function(e){
			e.preventDefault();
		});
		this.child.progress_wrapper.addClass('progress-adding');

		var data = {
			upload_key: this.upload_key,
			tag: this.submodule.tags.get_terms(),
			source: this.child.source.val(),
			group: this.submodule.groups.get_terms(),
			pack: this.submodule.packs.get_terms(),
			manga: this.submodule.manga.get_terms(),
			artist: this.child.artist.is(':visible') ? 1 : 0,
			comment: this.submodule.comment.get_text(),
			approved: this.child.approved.is(':visible') ? 1 : 0
		};

		Ajax.api('create_art', data, function(response) {
			this.child.add.hide();
			this.child.progress_wrapper.removeClass('progress-adding');

			if (!response.id) {
				this.process_error({code: 540, error: ''});
				return;
			}

			this.child.progress_wrapper.removeClass('progress-successful');
			this.child.progress_wrapper.html('<a href="/' +
				response.id + '" target="_blank">Успешно добавлено</a>');
			this.disable_edit();
		}, function(data){
			this.process_error(data.errors[0]);
		}, this);
	},
	events: {
		add: {
			click: function(e) {
				e.preventDefault();
				this.add_callback = null;
				this.do_add();
			}
		},
		cancel: {
			click: function(e) {
				var text = "Вы уверены, что хотите удалить это изображение?\n" +
					"Это действие сотрет загруженный файл, все добавленные к нему теги и прочие данные";
				if (!confirm(text)) {
					e.preventDefault();
					e.stopPropagation();
					return;
				}
				if (this.uploaded) {
					this.el.remove();
					this.message('file_number_changed');
				} else {
					this.message('file_number_changed', -1);
				}
			}
		},
		remove: {
			click: function(e) {
				this.el.remove();
				this.message('file_number_changed');
			}
		},
		show: {
			click: function(e) {
				var el = $(e.target);
				if (!el.is('button')) {
					el = el.parents('button');
				}
				var index = el.index();

				this.child.data.children().eq(index).show();
				el.hide();
			}
		},
		hide: {
			click: function(e) {
				var el = $(e.target).parents('.data_block'),
					index = el.index();

				this.child.show_panel.children().eq(index).show();
				el.hide();
			}
		}
	},
	listen: {
		upload_done: function(id, data) {
			if (this.el.attr('id') == id) {
				this.uploaded = true;
				if (typeof data.error != 'undefined') {
					this.process_error(data);
				} else {
					this.process_success(data);
				}
			}
		},
		add_all: function() {
			if ($('.template-upload:not(.editing-disabled)').index(this.el) === 0) {
				this.add_callback = function(){
					this.message('add_all');
				};
				this.do_add();
			}
		},
		remove_all: function() {
			this.child.remove.click();
		}
	}
});

OBJECT.add_pools = function(id, values, events) {
	OBJECT.pool_tip.call(this, id, values, events);

	this.child.selected.find('.pool button').click(function(){
		$(this).parents('.pool').remove();
	});
};

extend(OBJECT.add_pools, OBJECT.pool_tip, {
	class_name: 'add_pool',
	max_tip_length: 120,
	minimum_term_length: 0,
	child_config: {
		field: '.text',
		tip: '.tips',
		selected: '.selected'
	},
	get_terms: function() {
		var ret = [],
			me = this;
		this.child.selected.find('.pool').each(function(){
			ret.push(me.read_input(this));
		});
		return ret;
	},
	read_input: function(field) {
		return {id: $(field).data('id')};
	},
	disable: function() {
		this.child.field.hide();
		this.child.tip.hide();
	}
});

OBJECT.add_groups = function(id, values, events) {
	OBJECT.add_pools.call(this, id, values, events);
};

extend(OBJECT.add_groups, OBJECT.add_pools, {
	class_name: 'add_groups',
	address: 'tip_group'
});

OBJECT.add_packs = function(id, values, events) {
	OBJECT.add_pools.call(this, id, values, events);
};

extend(OBJECT.add_packs, OBJECT.add_pools, {
	class_name: 'add_packs',
	address: 'tip_pack',
	filename: '',
	disable: function() {
		this.get_super().disable.call(this);
		$.each(this.child.selected.find('.filename'), function(){
			$(this).replaceWith($('<div/>').addClass('filename').
				addClass('input-done').text($(this).val()));
		});
	},
	read_input: function(field) {
		var name = $(field).find('.filename').val() || field.filename;
		return {id: $(field).data('id'), filename: name};
	},
	build_selected: function(data){
		var insert = this.get_super().build_selected.call(this, data),
			filename = $('<input/>').attr('type', 'text')
				.addClass('filename').addClass('textinput');

		filename.val(this.filename).appendTo(insert);
		return insert;
	},
	set_default_filename: function(name) {
		this.filename = name;

		this.child.selected.find('.pool .filename').each(function(){
			if (!$(this).val()) {
				$(this).val(name);
			}
		});
	}
});

OBJECT.add_manga = function(id, values, events) {
	OBJECT.add_pools.call(this, id, values, events);
};

extend(OBJECT.add_manga, OBJECT.add_pools, {
	class_name: 'add_manga',
	address: 'tip_manga'
});

OBJECT.add_comment = function(id, values, events) {

	OBJECT.base.call(this, id, values, events);

	this.child.text.wysibb(wbbconfig);
};

extend(OBJECT.add_comment, OBJECT.base, {
	class_name: 'add_comment',
	child_config: {
		text: '.comment_text'
	},
	get_text: function() {
		return this.child.text.bbcode() || '';
	},
	disable: function() {
		var html = this.child.text.htmlcode() || '';
		this.child.text.destroy();
		this.child.text.replaceWith($('<div/>').
			addClass('input-done').html(html));
	}
});