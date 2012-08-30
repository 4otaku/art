OBJECT.upload = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.el.fileupload({
		uploadTemplateId: null,
		downloadTemplateId: null,
		uploadTemplate: function (o) {
			var rows = $();
			$.each(o.files, function (index, file) {
				var row = $('<tr class="template-upload fade">' +
					'<td class="preview"><span class="fade"></span></td>' +
					'<td class="name"></td>' +
					'<td class="size"></td>' +
					(file.error ? '<td class="error" colspan="2"></td>' :
							'<td><div class="progress">' +
								'<div class="bar" style="width:0%;"></div></div></td>' +
								'<td class="start"><button>Start</button></td>'
					) + '<td class="cancel"><button>Cancel</button></td></tr>');
				row.find('.name').text(file.name);
				row.find('.size').text(o.formatFileSize(file.size));
				if (file.error) {
					row.find('.error').text(
						locale.fileupload.errors[file.error] || file.error
					);
				}
				rows = rows.add(row);
			});
			return rows;
		},
		downloadTemplate: function (o) {
			var rows = $();
			$.each(o.files, function (index, file) {
				var row = $('<tr class="template-download fade">' +
					(file.error ? '<td></td><td class="name"></td>' +
						'<td class="size"></td><td class="error" colspan="2"></td>' :
							'<td class="preview"></td>' +
								'<td class="name"><a></a></td>' +
								'<td class="size"></td><td colspan="2"></td>'
					) + '<td class="delete"><button>Delete</button> ' +
						'<input type="checkbox" name="delete" value="1"></td></tr>');
				row.find('.size').text(o.formatFileSize(file.size));
				if (file.error) {
					row.find('.name').text(file.name);
					row.find('.error').text(
						locale.fileupload.errors[file.error] || file.error
					);
				} else {
					row.find('.name a').text(file.name);
					if (file.thumbnail_url) {
						row.find('.preview').append('<a><img></a>')
							.find('img').prop('src', file.thumbnail_url);
						row.find('a').prop('rel', 'gallery');
					}
					row.find('a').prop('href', file.url);
					row.find('.delete button')
						.attr('data-type', file.delete_type)
						.attr('data-url', file.delete_url);
				}
				rows = rows.add(row);
			});
			return rows;
		}
	});
}

extend(OBJECT.upload, OBJECT.base, {
	class_name: 'upload'
});

OBJECT.add = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);
/*
	this.child.upload.fileupload({
		dataType: 'json',
		done: function (e, data) {
			$.each(data.result, function (index, file) {
				$('<p/>').text(file.name).appendTo(document.body);
			});
		}
	});
	console.log(this); */
}

extend(OBJECT.add, OBJECT.base, {
	class_name: 'add',
	child_config: {
		upload: 'button.upload'
	}
});
