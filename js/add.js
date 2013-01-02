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

window.locale = {
	fileupload: {
		errors: {
			"maxFileSize": "Слишком большой файл",
			"acceptFileTypes": "Файл не является корректным изображением gif/jpg/png",
			"uploadedBytes": "Ошибка загрузки",
			"emptyResult": "Сервер не отвечает"
		}
	}
};

extend(OBJECT.upload, OBJECT.base, {
	class_name: 'upload',
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
	}
});

OBJECT.add = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.child.cancel.off(".upload");
	this.translate_size();
	this.child.name.html(
		this.fix_name_length(this.child.name.html()));
}

extend(OBJECT.add, OBJECT.base, {
	class_name: 'add',
	uploaded: false,
	child_config: {
		preview: 'div.preview',
		name: 'div.name span',
		size: 'div.size span',
		add_wrapper: 'div.add',
		upload_wrapper: 'div.start',
		progress_wrapper: 'div.progress-bar',
		error_wrapper: 'div.error',
		error: 'div.error .label',
		add: 'div.add button',
		cancel: 'div.cancel button',
		data: 'div.data_active',
		hide: 'div.data_active .hide_data',
		show_panel: 'div.data_passive',
		show: 'div.data_passive .show_data'
	},
	process_success: function(data) {
		this.child.preview.html('<img src="'+data.thumbnail_url+'" />');
		var name = this.fix_name_length(data.name);
		this.child.name.html('<a href="'+data.url+'" target="_blank">' +
			name + '</a>');
		this.translate_size();
		this.child.upload_wrapper.html('&nbsp;');
		this.child.progress_wrapper.html('&nbsp;');
		this.child.progress_wrapper.addClass('progress-successful');
	},
	process_error: function(data) {
		if (data.code == 30) {
			this.child.error.html('Уже добавлено');
			this.child.error_wrapper.append('<a href="/'+data.error+'" target="_blank">Посмотреть</a>');
		} else if (data.code == 10) {
			this.child.error.html(locale.fileupload.errors.maxFileSize);
		} else if (data.code == 20 || data.code == 260) {
			this.child.error.html(locale.fileupload.errors.acceptFileTypes);
		} else {
			this.child.error.html(data.error);
		}

		this.child.add_wrapper.html('&nbsp;');
		this.child.upload_wrapper.html('&nbsp;');
		this.child.progress_wrapper.hide();
		this.child.error_wrapper.removeClass('hidden');
	},
	translate_size: function () {
		var size = this.child.size.html();
		size = size.replace('GB', 'Гб')
			.replace('MB', 'Мб').replace('KB', 'Кб');
		this.child.size.html(size);
	},
	fix_name_length: function(name) {
		if (name.length < 22) {
			return name;
		}

		var ext = name.match(/\.[a-z\d]{1,5}$/i)[0] || '';
		var part_length = Math.floor((18 - ext.length) / 2);
		name = name.substr(0, name.length - ext.length);
		return name.substr(0, part_length) +
			'..' + name.substr(-1 * part_length) + ext;
	},
	events: {
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
				}
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
				if (data.error) {
					this.process_error(data);
				} else {
					this.process_success(data);
				}
			}
		}
	}
});

OBJECT.add_tags = function(id, values, events) {
	OBJECT.ajaxtip.call(this, id, values, events);

	this.child.field.css('overflow', 'hidden').autogrow();
}

extend(OBJECT.add_tags, OBJECT.ajaxtip, {
	class_name: 'add_tags',
	address: 'tip_tag',
	child_config: {
		field: '.tags',
		tip: '.tips'
	}/*,
	colors: {},
	get_current: function() {
		var range = rangy.getSelection().getRangeAt(0),
			text = range.endContainer.nodeValue || '',
			current = text.substr(0, range.endOffset);
		return current.replace(/^.*[\s\u200b]/, '');
	},
	build_tip_box: function(items) {
		var me = this;
		$.each(items, function(key, item){
			me.colors[item.name.toLocaleLowerCase()] = item.color || '';
		});

		return this.get_super().build_tip_box.call(this, items);
	},
	on_tip_click: function(data){
		var range = rangy.getSelection().getRangeAt(0),
			text = range.endContainer.nodeValue || '',
			current = text.substr(0, range.endOffset),
			leftover = text.substr(range.endOffset);

		range.endContainer.nodeValue =
			current.replace(/[^\s\u200b]*$/, data.term) + leftover;

		this.parse_contents();
	},
	parse_contents: function() {
		var text = this.child.field.text(),
			add_space = text.match(/\s$/),
			tags = text.split(/\s|\u200b/),
			html = '&#8203;',
			colors = this.colors;
		$.each(tags, function(key, tag){
			if (!tag.length) {
				return;
			}
			var search = tag.toLocaleLowerCase();
			var color = colors[search] ? colors[search] : 'auto';
			html += '<span style="color: #' + color + '">'
				+ tag + '</span> ';
		});
		if (!add_space) {
			html = html.replace(/ $/, '');
		} else {
			html += '<span></span>';
		}

		this.child.field.html(html);

		var range = rangy.createRange();
		var last = this.child.field[0].lastChild;
		range.setStartAfter(last);
		range.setEndAfter(last);
		var sel = rangy.getSelection();
		sel.setSingleRange(range);
	},
	events: {
		field: {
			keyup: function(e) {
				this.get_super().events
					.field.keyup.call(this, e);

				this.child.field.children('br').remove();
				if (!this.child.field.text().length) {
					this.child.field.html('&#8203;');
				}

				if (e.keyCode == 17 && e.ctrlKey) {
					this.parse_contents();
				}
				if (e.keyCode == 32) {
					var range = rangy.getSelection().getRangeAt(0);

					if (range.endContainer == range.startContainer &&
						range.endContainer == this.child.field[0].lastChild) {

						this.parse_contents();
					}
				}
			}
		}
	}*/
});