window.locale = {
	fileupload: {
		errors: {
			maxFileSize: "Слишком большой файл",
			acceptFileTypes: "Файл не является корректным изображением gif/jpg/png",
			uploadedBytes: "Ошибка загрузки",
			emptyResult: "Сервер не отвечает",
			serverError: "Сбой сервера"
		}
	}
};

$(window).bind('beforeunload', function(e) {
	return $('.template-upload:not(.editing-disabled)').length ?
		true: null;
});

OBJECT.upload = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.el.fileupload({
		namespace: 'upload',
		maxFileSize: 10 * 1024 * 1024,
		acceptFileTypes: /(gif|jpeg|png)$/i,
		previewSourceMaxFileSize: 10 * 1024 * 1024,
		limitConcurrentUploads: 3,
		previewMaxWidth: 150,
		previewMaxHeight: 150,
		done: this.doneCallback,
		fail: this.failCallback,
		downloadTemplateId: null
	}).bind('fileuploadadded', function (e, data){
		init_objects();
	});

	this.el.data('object', this);
}

extend(OBJECT.upload, OBJECT.base, {
	class_name: 'upload',
	child_config: {
		start: 'button.start',
		add: 'button.add'
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
		}
	},
	listen: {
		file_number_changed: function(modificator){
			modificator = modificator || 0;
			var count = $('.template-upload:not(.editing-disabled)').length;
			if (count + modificator > 1) {
				this.child.start.show();
				this.child.add.show();
			} else {
				this.child.start.hide();
				this.child.add.hide();
			}
		}
	}
});

OBJECT.add = function(id, values, events) {
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

	if (User.name) {
		if (User.gallery) {
			this.child.with_gallery.find('a')
				.attr('href', '/?artist=' + User.gallery);
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

	this.message('file_number_changed');
}

extend(OBJECT.add, OBJECT.base, {
	class_name: 'add',
	upload_key: false,
	uploaded: false,
	add_pending: false,
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
			this.child.add.click();
		}
	},
	process_error: function(data) {
		if (data.code == 30) {
			this.child.error.html('Уже добавлено');
			this.child.error_wrapper.append('<a href="/'+data.error+'" target="_blank">Посмотреть</a>');
		} else if (data.code == 10) {
			this.child.error.html(locale.fileupload.errors.maxFileSize);
		} else if (data.code == 20 || data.code == 260) {
			this.child.error.html(locale.fileupload.errors.acceptFileTypes);
		} else if (data.code == 540) {
			this.child.error.html(locale.fileupload.errors.serverError);
		} else {
			this.child.error.html('Неизвестная ошибка');
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
	events: {
		add: {
			click: function(e) {
				e.preventDefault();
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

				Ajax.perform('/ajax/create', data, function(response) {
					this.child.add.hide();
					this.child.progress_wrapper.removeClass('progress-adding');

					if (response.errors) {
						this.process_error({
							code: response.errors[0].code,
							error: response.errors[0].message
						});
						return;
					}
					if (!response.id) {
						this.process_error({code: 540, error: ''});
						return;
					}

					this.child.progress_wrapper.removeClass('progress-successful');
					this.child.progress_wrapper.html('<a href="/' +
						response.id + '" target="_blank">Успешно добавлено</a>');
					this.disable_edit();

				}, this);
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
			this.child.add.click();
		}
	}
});

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
			if (current.indexOf(tag) == -1) {
				prepend += tag + ' ';
			}
		}, this));

		if (prepend) {
			var val = this.child.field.val();
			var pos = this.child.field.caret().start || 0;
			this.child.field.val(val.substr(0, 1) + prepend + val.substr(1));
			if (this.child.field.is(':focus')) {
				this.child.field.caretTo(pos + prepend.length);
			}
		}
	}
});

OBJECT.add_pools = function(id, values, events) {
	OBJECT.pool_tip.call(this, id, values, events);

	this.child.selected.find('.pool button').click(function(){
		$(this).parents('.pool').remove();
	});
}

extend(OBJECT.add_pools, OBJECT.pool_tip, {
	class_name: 'add_pool',
	max_tip_length: 120,
	minimum_term_length: 0,
	child_config: {
		field: '.text',
		tip: '.tips',
		selected: '.selected'
	},
	disable: function() {
		this.child.field.hide();
		this.child.tip.hide();
	}
});

OBJECT.add_groups = function(id, values, events) {
	OBJECT.add_pools.call(this, id, values, events);
}

extend(OBJECT.add_groups, OBJECT.add_pools, {
	class_name: 'add_groups',
	address: 'tip_group'
});

OBJECT.add_packs = function(id, values, events) {
	OBJECT.add_pools.call(this, id, values, events);
}

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
	get_terms: function() {
		var ret = [];
		this.child.selected.find('.pool').each(function(){
			var name = $(this).find('.filename').val() || this.filename;
			ret.push({id: $(this).data('id'), filename: name});
		});
		return ret;
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
}

extend(OBJECT.add_manga, OBJECT.add_pools, {
	class_name: 'add_manga',
	address: 'tip_manga'
});

OBJECT.add_comment = function(id, values, events) {

	OBJECT.base.call(this, id, values, events);

	this.child.text.wysibb({
		buttons: 'bold,italic,strike,|,fontsize,fontcolor,|,link'
	});
}

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