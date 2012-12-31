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
		cancel: 'div.cancel button'
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
