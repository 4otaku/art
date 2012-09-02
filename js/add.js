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
}

extend(OBJECT.add, OBJECT.base, {
	class_name: 'add',
	child_config: {
		preview: 'td.preview',
		add_wrapper: 'td.add',
		upload_wrapper: 'td.start',
		progress_wrapper: 'td.progress-bar',
		error_wrapper: 'td.error',
		error: 'td.error .label',
		add: 'td.add button',
		cancel: 'td.cancel button'
	},
	processSuccess: function(data) {
		this.child.preview.html('<img src="'+data.thumbnail_url+'"/>');
		this.child.upload_wrapper.html('');
		this.child.progress_wrapper.html('');
		this.child.progress_wrapper.addClass('progress-successful');
	},
	processError: function(data) {
		if (data.code == 30) {
			this.child.error.html('Уже добавлено');
			this.child.error_wrapper.append('<a href="/'+data.error+'" target="_blank">Перейти</a>');
		} else if (data.code == 10) {
			this.child.error.html(locale.fileupload.errors.maxFileSize);
		} else if (data.code == 20 || data.code == 260) {
			this.child.error.html(locale.fileupload.errors.acceptFileTypes);
		} else {
			this.child.error.html(data.error);
		}

		this.child.add_wrapper.hide();
		this.child.upload_wrapper.hide();
		this.child.progress_wrapper.hide();
		this.child.error_wrapper.removeClass('hidden');
	},
	events: {
		cancel: {
			click: function(e) {
				var text = "Вы уверены, что хотите удалить это изображение?\n" +
					"Это удалит загруженный файл, все добавленные к нему теги и прочие данные";
				if (!confirm(text)) {
					e.preventDefault();
					e.stopPropagation();
				}
			}
		}
	},
	listen: {
		upload_done: function(id, data) {
			if (this.el.attr('id') == id) {
				if (data.error) {
					this.processError(data);
				} else {
					this.processSuccess(data);
				}
			}
		}
	}
});
