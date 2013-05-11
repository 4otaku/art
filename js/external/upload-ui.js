/*
 * JavaScript Templates 2.1.0
 * https://github.com/blueimp/JavaScript-Templates
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Inspired by John Resig's JavaScript Micro-Templating:
 * http://ejohn.org/blog/javascript-micro-templating/
 */

/*jslint evil: true, regexp: true */
/*global document, define */

(function ($) {
	"use strict";
	var tmpl = function (str, data) {
		var f = !/[^\w\-\.:]/.test(str) ? tmpl.cache[str] = tmpl.cache[str] ||
			tmpl(tmpl.load(str)) :
			new Function(
				tmpl.arg + ',tmpl',
				"var _e=tmpl.encode" + tmpl.helper + ",_s='" +
					str.replace(tmpl.regexp, tmpl.func) +
					"';return _s;"
			);
		return data ? f(data, tmpl) : function (data) {
			return f(data, tmpl);
		};
	};
	tmpl.cache = {};
	tmpl.load = function (id) {
		return document.getElementById(id).innerHTML;
	};
	tmpl.regexp = /([\s'\\])(?![^%]*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g;
	tmpl.func = function (s, p1, p2, p3, p4, p5) {
		if (p1) { // whitespace, quote and backspace in interpolation context
			return {
				"\n": "\\n",
				"\r": "\\r",
				"\t": "\\t",
				" " : " "
			}[s] || "\\" + s;
		}
		if (p2) { // interpolation: {%=prop%}, or unescaped: {%#prop%}
			if (p2 === "=") {
				return "'+_e(" + p3 + ")+'";
			}
			return "'+(" + p3 + "||'')+'";
		}
		if (p4) { // evaluation start tag: {%
			return "';";
		}
		if (p5) { // evaluation end tag: %}
			return "_s+='";
		}
	};
	tmpl.encReg = /[<>&"'\x00]/g;
	tmpl.encMap = {
		"<"   : "&lt;",
		">"   : "&gt;",
		"&"   : "&amp;",
		"\""  : "&quot;",
		"'"   : "&#39;"
	};
	tmpl.encode = function (s) {
		return String(s || "").replace(
			tmpl.encReg,
			function (c) {
				return tmpl.encMap[c] || "";
			}
		);
	};
	tmpl.arg = "o";
	tmpl.helper = ",print=function(s,e){_s+=e&&(s||'')||_e(s);}" +
		",include=function(s,d){_s+=tmpl(s,d);}";
	if (typeof define === "function" && define.amd) {
		define(function () {
			return tmpl;
		});
	} else {
		$.tmpl = tmpl;
	}
}(this));

/*
 * JavaScript Load Image 1.2.1
 * https://github.com/blueimp/JavaScript-Load-Image
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint nomen: true */
/*global window, document, URL, webkitURL, Blob, File, FileReader, define */

(function ($) {
	'use strict';

	// Loads an image for a given File object.
	// Invokes the callback with an img or optional canvas
	// element (if supported by the browser) as parameter:
	var loadImage = function (file, callback, options) {
			var img = document.createElement('img'),
				url,
				oUrl;
			img.onerror = callback;
			img.onload = function () {
				if (oUrl && !(options && options.noRevoke)) {
					loadImage.revokeObjectURL(oUrl);
				}
				callback(loadImage.scale(img, options));
			};
			if ((window.Blob && file instanceof Blob) ||
				// Files are also Blob instances, but some browsers
				// (Firefox 3.6) support the File API but not Blobs:
				(window.File && file instanceof File)) {
				url = oUrl = loadImage.createObjectURL(file);
			} else {
				url = file;
			}
			if (url) {
				img.src = url;
				return img;
			}
			return loadImage.readFile(file, function (url) {
				img.src = url;
			});
		},
	// The check for URL.revokeObjectURL fixes an issue with Opera 12,
	// which provides URL.createObjectURL but doesn't properly implement it:
		urlAPI = (window.createObjectURL && window) ||
			(window.URL && URL.revokeObjectURL && URL) ||
			(window.webkitURL && webkitURL);

	// Scales the given image (img or canvas HTML element)
	// using the given options.
	// Returns a canvas object if the browser supports canvas
	// and the canvas option is true or a canvas object is passed
	// as image, else the scaled image:
	loadImage.scale = function (img, options) {
		options = options || {};
		var canvas = document.createElement('canvas'),
			width = img.width,
			height = img.height,
			scale = Math.max(
				(options.minWidth || width) / width,
				(options.minHeight || height) / height
			);
		if (scale > 1) {
			width = parseInt(width * scale, 10);
			height = parseInt(height * scale, 10);
		}
		scale = Math.min(
			(options.maxWidth || width) / width,
			(options.maxHeight || height) / height
		);
		if (scale < 1) {
			width = parseInt(width * scale, 10);
			height = parseInt(height * scale, 10);
		}
		if (img.getContext || (options.canvas && canvas.getContext)) {
			canvas.width = width;
			canvas.height = height;
			canvas.getContext('2d')
				.drawImage(img, 0, 0, width, height);
			return canvas;
		}
		img.width = width;
		img.height = height;
		return img;
	};

	loadImage.createObjectURL = function (file) {
		return urlAPI ? urlAPI.createObjectURL(file) : false;
	};

	loadImage.revokeObjectURL = function (url) {
		return urlAPI ? urlAPI.revokeObjectURL(url) : false;
	};

	// Loads a given File object via FileReader interface,
	// invokes the callback with a data url:
	loadImage.readFile = function (file, callback) {
		if (window.FileReader && FileReader.prototype.readAsDataURL) {
			var fileReader = new FileReader();
			fileReader.onload = function (e) {
				callback(e.target.result);
			};
			fileReader.readAsDataURL(file);
			return fileReader;
		}
		return false;
	};

	if (typeof define === 'function' && define.amd) {
		define(function () {
			return loadImage;
		});
	} else {
		$.loadImage = loadImage;
	}
}(this));

/*
 * JavaScript Canvas to Blob 2.0.3
 * https://github.com/blueimp/JavaScript-Canvas-to-Blob
 *
 * Copyright 2012, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Based on stackoverflow user Stoive's code snippet:
 * http://stackoverflow.com/q/4998908
 */

/*jslint nomen: true, regexp: true */
/*global window, atob, Blob, ArrayBuffer, Uint8Array, define */

(function (window) {
	'use strict';
	var CanvasPrototype = window.HTMLCanvasElement &&
			window.HTMLCanvasElement.prototype,
		hasBlobConstructor = window.Blob && (function () {
			try {
				return Boolean(new Blob());
			} catch (e) {
				return false;
			}
		}()),
		hasArrayBufferViewSupport = hasBlobConstructor && window.Uint8Array &&
			(function () {
				try {
					return new Blob([new Uint8Array(100)]).size === 100;
				} catch (e) {
					return false;
				}
			}()),
		BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder ||
			window.MozBlobBuilder || window.MSBlobBuilder,
		dataURLtoBlob = (hasBlobConstructor || BlobBuilder) && window.atob &&
			window.ArrayBuffer && window.Uint8Array && function (dataURI) {
			var byteString,
				arrayBuffer,
				intArray,
				i,
				mimeString,
				bb;
			if (dataURI.split(',')[0].indexOf('base64') >= 0) {
				// Convert base64 to raw binary data held in a string:
				byteString = atob(dataURI.split(',')[1]);
			} else {
				// Convert base64/URLEncoded data component to raw binary data:
				byteString = decodeURIComponent(dataURI.split(',')[1]);
			}
			// Write the bytes of the string to an ArrayBuffer:
			arrayBuffer = new ArrayBuffer(byteString.length);
			intArray = new Uint8Array(arrayBuffer);
			for (i = 0; i < byteString.length; i += 1) {
				intArray[i] = byteString.charCodeAt(i);
			}
			// Separate out the mime component:
			mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
			// Write the ArrayBuffer (or ArrayBufferView) to a blob:
			if (hasBlobConstructor) {
				return new Blob(
					[hasArrayBufferViewSupport ? intArray : arrayBuffer],
					{type: mimeString}
				);
			}
			bb = new BlobBuilder();
			bb.append(arrayBuffer);
			return bb.getBlob(mimeString);
		};
	if (window.HTMLCanvasElement && !CanvasPrototype.toBlob) {
		if (CanvasPrototype.mozGetAsFile) {
			CanvasPrototype.toBlob = function (callback, type) {
				callback(this.mozGetAsFile('blob', type));
			};
		} else if (CanvasPrototype.toDataURL && dataURLtoBlob) {
			CanvasPrototype.toBlob = function (callback, type) {
				callback(dataURLtoBlob(this.toDataURL(type)));
			};
		}
	}
	if (typeof define === 'function' && define.amd) {
		define(function () {
			return dataURLtoBlob;
		});
	} else {
		window.dataURLtoBlob = dataURLtoBlob;
	}
}(this));

/*
 * jQuery File Upload File Processing Plugin 1.0
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2012, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint nomen: true, unparam: true, regexp: true */
/*global define, window, document */

(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		// Register as an anonymous AMD module:
		define([
			'jquery',
			'load-image',
			'canvas-to-blob',
			'./jquery.fileupload'
		], factory);
	} else {
		// Browser globals:
		factory(
			window.jQuery,
			window.loadImage
		);
	}
}(function ($, loadImage) {
	'use strict';

	// The File Upload IP version extends the basic fileupload widget
	// with file processing functionality:
	$.widget('blueimpFP.fileupload', $.blueimp.fileupload, {

		options: {
			// The list of file processing actions:
			process: [
				/*
				 {
				 action: 'load',
				 fileTypes: /^image\/(gif|jpeg|png)$/,
				 maxFileSize: 20000000 // 20MB
				 },
				 {
				 action: 'resize',
				 maxWidth: 1920,
				 maxHeight: 1200,
				 minWidth: 800,
				 minHeight: 600
				 },
				 {
				 action: 'save'
				 }
				 */
			],

			// The add callback is invoked as soon as files are added to the
			// fileupload widget (via file input selection, drag & drop or add
			// API call). See the basic file upload widget for more information:
			add: function (e, data) {
				$(this).fileupload('process', data).done(function () {
					data.submit();
				});
			}
		},

		processActions: {
			// Loads the image given via data.files and data.index
			// as canvas element.
			// Accepts the options fileTypes (regular expression)
			// and maxFileSize (integer) to limit the files to load:
			load: function (data, options) {
				var that = this,
					file = data.files[data.index],
					dfd = $.Deferred();
				if (window.HTMLCanvasElement &&
					window.HTMLCanvasElement.prototype.toBlob &&
					($.type(options.maxFileSize) !== 'number' ||
						file.size < options.maxFileSize) &&
					(!options.fileTypes ||
						options.fileTypes.test(file.type))) {
					loadImage(
						file,
						function (canvas) {
							data.canvas = canvas;
							dfd.resolveWith(that, [data]);
						},
						{canvas: true}
					);
				} else {
					dfd.rejectWith(that, [data]);
				}
				return dfd.promise();
			},
			// Resizes the image given as data.canvas and updates
			// data.canvas with the resized image.
			// Accepts the options maxWidth, maxHeight, minWidth and
			// minHeight to scale the given image:
			resize: function (data, options) {
				if (data.canvas) {
					var canvas = loadImage.scale(data.canvas, options);
					if (canvas.width !== data.canvas.width ||
						canvas.height !== data.canvas.height) {
						data.canvas = canvas;
						data.processed = true;
					}
				}
				return data;
			},
			// Saves the processed image given as data.canvas
			// inplace at data.index of data.files:
			save: function (data, options) {
				// Do nothing if no processing has happened:
				if (!data.canvas || !data.processed) {
					return data;
				}
				var that = this,
					file = data.files[data.index],
					name = file.name,
					dfd = $.Deferred(),
					callback = function (blob) {
						if (!blob.name) {
							if (file.type === blob.type) {
								blob.name = file.name;
							} else if (file.name) {
								blob.name = file.name.replace(
									/\..+$/,
									'.' + blob.type.substr(6)
								);
							}
						}
						// Store the created blob at the position
						// of the original file in the files list:
						data.files[data.index] = blob;
						dfd.resolveWith(that, [data]);
					};
				// Use canvas.mozGetAsFile directly, to retain the filename, as
				// Gecko doesn't support the filename option for FormData.append:
				if (data.canvas.mozGetAsFile) {
					callback(data.canvas.mozGetAsFile(
						(/^image\/(jpeg|png)$/.test(file.type) && name) ||
							((name && name.replace(/\..+$/, '')) ||
								'blob') + '.png',
						file.type
					));
				} else {
					data.canvas.toBlob(callback, file.type);
				}
				return dfd.promise();
			}
		},

		// Resizes the file at the given index and stores the created blob at
		// the original position of the files list, returns a Promise object:
		_processFile: function (files, index, options) {
			var that = this,
				dfd = $.Deferred().resolveWith(that, [{
					files: files,
					index: index
				}]),
				chain = dfd.promise();
			that._processing += 1;
			$.each(options.process, function (i, settings) {
				chain = chain.pipe(function (data) {
					return that.processActions[settings.action]
						.call(this, data, settings);
				});
			});
			chain.always(function () {
				that._processing -= 1;
				if (that._processing === 0) {
					that.element
						.removeClass('fileupload-processing');
				}
			});
			if (that._processing === 1) {
				that.element.addClass('fileupload-processing');
			}
			return chain;
		},

		// Processes the files given as files property of the data parameter,
		// returns a Promise object that allows to bind a done handler, which
		// will be invoked after processing all files (inplace) is done:
		process: function (data) {
			var that = this,
				options = $.extend({}, this.options, data);
			if (options.process && options.process.length &&
				this._isXHRUpload(options)) {
				$.each(data.files, function (index, file) {
					that._processingQueue = that._processingQueue.pipe(
						function () {
							var dfd = $.Deferred();
							that._processFile(data.files, index, options)
								.always(function () {
									dfd.resolveWith(that);
								});
							return dfd.promise();
						}
					);
				});
			}
			return this._processingQueue;
		},

		_create: function () {
			$.blueimp.fileupload.prototype._create.call(this);
			this._processing = 0;
			this._processingQueue = $.Deferred().resolveWith(this)
				.promise();
		}

	});

}));

/*
 * jQuery File Upload User Interface Plugin 6.9.4
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint nomen: true, unparam: true, regexp: true */
/*global define, window, document, URL, webkitURL, FileReader */

(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		// Register as an anonymous AMD module:
		define([
			'jquery',
			'tmpl',
			'load-image',
			'./jquery.fileupload-fp'
		], factory);
	} else {
		// Browser globals:
		factory(
			window.jQuery,
			window.tmpl,
			window.loadImage
		);
	}
}(function ($, tmpl, loadImage) {
	'use strict';

	// The UI version extends the FP (file processing) version or the basic
	// file upload widget and adds complete user interface interaction:
	var parentWidget = ($.blueimpFP || $.blueimp).fileupload;
	$.widget('blueimpUI.fileupload', parentWidget, {

		options: {
			// By default, files added to the widget are uploaded as soon
			// as the user clicks on the start buttons. To enable automatic
			// uploads, set the following option to true:
			autoUpload: false,
			// The following option limits the number of files that are
			// allowed to be uploaded using this widget:
			maxNumberOfFiles: undefined,
			// The maximum allowed file size:
			maxFileSize: undefined,
			// The minimum allowed file size:
			minFileSize: undefined,
			// The regular expression for allowed file types, matches
			// against either file type or file name:
			acceptFileTypes:  /.+$/i,
			// The regular expression to define for which files a preview
			// image is shown, matched against the file type:
			previewSourceFileTypes: /^image\/(gif|jpeg|png)$/,
			// The maximum file size of images that are to be displayed as preview:
			previewSourceMaxFileSize: 5000000, // 5MB
			// The maximum width of the preview images:
			previewMaxWidth: 80,
			// The maximum height of the preview images:
			previewMaxHeight: 80,
			// By default, preview images are displayed as canvas elements
			// if supported by the browser. Set the following option to false
			// to always display preview images as img elements:
			previewAsCanvas: true,
			// The ID of the upload template:
			uploadTemplateId: 'template-upload',
			// The ID of the download template:
			downloadTemplateId: 'template-download',
			// The container for the list of files. If undefined, it is set to
			// an element with class "files" inside of the widget element:
			filesContainer: undefined,
			// By default, files are appended to the files container.
			// Set the following option to true, to prepend files instead:
			prependFiles: false,
			// The expected data type of the upload response, sets the dataType
			// option of the $.ajax upload requests:
			dataType: 'json',

			// The add callback is invoked as soon as files are added to the fileupload
			// widget (via file input selection, drag & drop or add API call).
			// See the basic file upload widget for more information:
			add: function (e, data) {
				var that = $(this).data('fileupload'),
					options = that.options,
					files = data.files;
				$(this).fileupload('process', data).done(function () {
					that._adjustMaxNumberOfFiles(-files.length);
					data.maxNumberOfFilesAdjusted = true;
					data.files.valid = data.isValidated = that._validate(files);
					data.context = that._renderUpload(files).data('data', data);
					options.filesContainer[
						options.prependFiles ? 'prepend' : 'append'
						](data.context);
					that._renderPreviews(files, data.context);
					that._forceReflow(data.context);
					that._transition(data.context).done(
						function () {
							if ((that._trigger('added', e, data) !== false) &&
								(options.autoUpload || data.autoUpload) &&
								data.autoUpload !== false && data.isValidated) {
								data.submit();
							}
						}
					);
				});
			},
			// Callback for the start of each file upload request:
			send: function (e, data) {
				var that = $(this).data('fileupload');
				if (!data.isValidated) {
					if (!data.maxNumberOfFilesAdjusted) {
						that._adjustMaxNumberOfFiles(-data.files.length);
						data.maxNumberOfFilesAdjusted = true;
					}
					if (!that._validate(data.files)) {
						return false;
					}
				}
				if (data.context && data.dataType &&
					data.dataType.substr(0, 6) === 'iframe') {
					// Iframe Transport does not support progress events.
					// In lack of an indeterminate progress bar, we set
					// the progress to 100%, showing the full animated bar:
					data.context
						.find('.progress').addClass(
							!$.support.transition && 'progress-animated'
						)
						.attr('aria-valuenow', 100)
						.find('.bar').css(
							'width',
							'100%'
						);
				}
				return that._trigger('sent', e, data);
			},
			// Callback for successful uploads:
			done: function (e, data) {
				var that = $(this).data('fileupload'),
					template;
				if (data.context) {
					data.context.each(function (index) {
						var file = ($.isArray(data.result) &&
							data.result[index]) || {error: 'emptyResult'};
						if (file.error) {
							that._adjustMaxNumberOfFiles(1);
						}
						that._transition($(this)).done(
							function () {
								var node = $(this);
								template = that._renderDownload([file])
									.replaceAll(node);
								that._forceReflow(template);
								that._transition(template).done(
									function () {
										data.context = $(this);
										that._trigger('completed', e, data);
									}
								);
							}
						);
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
					template = that._renderDownload(data.result)
						.appendTo(that.options.filesContainer);
					that._forceReflow(template);
					that._transition(template).done(
						function () {
							data.context = $(this);
							that._trigger('completed', e, data);
						}
					);
				}
			},
			// Callback for failed (abort or error) uploads:
			fail: function (e, data) {
				var that = $(this).data('fileupload'),
					template;
				if (data.maxNumberOfFilesAdjusted) {
					that._adjustMaxNumberOfFiles(data.files.length);
				}
				if (data.context) {
					data.context.each(function (index) {
						if (data.errorThrown !== 'abort') {
							var file = data.files[index];
							file.error = file.error || data.errorThrown ||
								true;
							that._transition($(this)).done(
								function () {
									var node = $(this);
									template = that._renderDownload([file])
										.replaceAll(node);
									that._forceReflow(template);
									that._transition(template).done(
										function () {
											data.context = $(this);
											that._trigger('failed', e, data);
										}
									);
								}
							);
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
			// Callback for upload progress events:
			progress: function (e, data) {
				if (data.context) {
					var progress = parseInt(data.loaded / data.total * 100, 10);
					data.context.find('.progress')
						.attr('aria-valuenow', progress)
						.find('.bar').css(
							'width',
							progress + '%'
						);
				}
			},
			// Callback for global upload progress events:
			progressall: function (e, data) {
				var $this = $(this),
					progress = parseInt(data.loaded / data.total * 100, 10),
					globalProgressNode = $this.find('.fileupload-progress'),
					extendedProgressNode = globalProgressNode
						.find('.progress-extended');
				if (extendedProgressNode.length) {
					extendedProgressNode.html(
						$this.data('fileupload')._renderExtendedProgress(data)
					);
				}
				globalProgressNode
					.find('.progress')
					.attr('aria-valuenow', progress)
					.find('.bar').css(
						'width',
						progress + '%'
					);
			},
			// Callback for uploads start, equivalent to the global ajaxStart event:
			start: function (e) {
				var that = $(this).data('fileupload');
				that._transition($(this).find('.fileupload-progress')).done(
					function () {
						that._trigger('started', e);
					}
				);
			},
			// Callback for uploads stop, equivalent to the global ajaxStop event:
			stop: function (e) {
				var that = $(this).data('fileupload');
				that._transition($(this).find('.fileupload-progress')).done(
					function () {
						$(this).find('.progress')
							.attr('aria-valuenow', '0')
							.find('.bar').css('width', '0%');
						$(this).find('.progress-extended').html('&nbsp;');
						that._trigger('stopped', e);
					}
				);
			},
			// Callback for file deletion:
			destroy: function (e, data) {
				var that = $(this).data('fileupload');
				if (data.url) {
					$.ajax(data);
					that._adjustMaxNumberOfFiles(1);
				}
				that._transition(data.context).done(
					function () {
						$(this).remove();
						that._trigger('destroyed', e, data);
					}
				);
			}
		},

		// Link handler, that allows to download files
		// by drag & drop of the links to the desktop:
		_enableDragToDesktop: function () {
			var link = $(this),
				url = link.prop('href'),
				name = link.prop('download'),
				type = 'application/octet-stream';
			link.bind('dragstart', function (e) {
				try {
					e.originalEvent.dataTransfer.setData(
						'DownloadURL',
						[type, name, url].join(':')
					);
				} catch (err) {}
			});
		},

		_adjustMaxNumberOfFiles: function (operand) {
			if (typeof this.options.maxNumberOfFiles === 'number') {
				this.options.maxNumberOfFiles += operand;
				if (this.options.maxNumberOfFiles < 1) {
					this._disableFileInputButton();
				} else {
					this._enableFileInputButton();
				}
			}
		},

		_formatFileSize: function (bytes) {
			if (typeof bytes !== 'number') {
				return '';
			}
			if (bytes >= 1000000000) {
				return (bytes / 1000000000).toFixed(2) + ' ГБ';
			}
			if (bytes >= 1000000) {
				return (bytes / 1000000).toFixed(2) + ' МБ';
			}
			return (bytes / 1000).toFixed(2) + ' КБ';
		},

		_formatBitrate: function (bits) {
			if (typeof bits !== 'number') {
				return '';
			}
			if (bits >= 1000000000) {
				return (bits / 1000000000).toFixed(2) + ' Гбит/с';
			}
			if (bits >= 1000000) {
				return (bits / 1000000).toFixed(2) + ' Мбит/с';
			}
			if (bits >= 1000) {
				return (bits / 1000).toFixed(2) + ' Кбит/с';
			}
			return bits + ' bit/s';
		},

		_formatTime: function (seconds) {
			var date = new Date(seconds * 1000),
				days = parseInt(seconds / 86400, 10);
			days = days ? days + 'd ' : '';
			return days +
				('0' + date.getUTCHours()).slice(-2) + ':' +
				('0' + date.getUTCMinutes()).slice(-2) + ':' +
				('0' + date.getUTCSeconds()).slice(-2);
		},

		_formatPercentage: function (floatValue) {
			return (floatValue * 100).toFixed(2) + ' %';
		},

		_renderExtendedProgress: function (data) {
			return this._formatBitrate(data.bitrate) + ' | ' +
				this._formatTime(
					(data.total - data.loaded) * 8 / data.bitrate
				) + ' | ' +
				this._formatPercentage(
					data.loaded / data.total
				) + ' | ' +
				this._formatFileSize(data.loaded) + ' / ' +
				this._formatFileSize(data.total);
		},

		_hasError: function (file) {
			if (file.error) {
				return file.error;
			}
			// The number of added files is subtracted from
			// maxNumberOfFiles before validation, so we check if
			// maxNumberOfFiles is below 0 (instead of below 1):
			if (this.options.maxNumberOfFiles < 0) {
				return 'maxNumberOfFiles';
			}
			// Files are accepted if either the file type or the file name
			// matches against the acceptFileTypes regular expression, as
			// only browsers with support for the File API report the type:
			if (!(this.options.acceptFileTypes.test(file.type) ||
				this.options.acceptFileTypes.test(file.name))) {
				return 'acceptFileTypes';
			}
			if (this.options.maxFileSize &&
				file.size > this.options.maxFileSize) {
				return 'maxFileSize';
			}
			if (typeof file.size === 'number' &&
				file.size < this.options.minFileSize) {
				return 'minFileSize';
			}
			return null;
		},

		_validate: function (files) {
			var that = this,
				valid = !!files.length;
			$.each(files, function (index, file) {
				file.error = that._hasError(file);
				if (file.error) {
					valid = false;
				}
			});
			return valid;
		},

		_renderTemplate: function (func, files) {
			if (!func) {
				return $();
			}
			var result = func({
				files: files,
				formatFileSize: this._formatFileSize,
				options: this.options
			});
			if (result instanceof $) {
				return result;
			}
			return $(this.options.templatesContainer).html(result).children();
		},

		_renderPreview: function (file, node) {
			var that = this,
				options = this.options,
				dfd = $.Deferred();
			return ((loadImage && loadImage(
				file,
				function (img) {
					node.append(img);
					that._forceReflow(node);
					that._transition(node).done(function () {
						dfd.resolveWith(node);
					});
					if (!$.contains(document.body, node[0])) {
						// If the element is not part of the DOM,
						// transition events are not triggered,
						// so we have to resolve manually:
						dfd.resolveWith(node);
					}
				},
				{
					maxWidth: options.previewMaxWidth,
					maxHeight: options.previewMaxHeight,
					canvas: options.previewAsCanvas
				}
			)) || dfd.resolveWith(node)) && dfd;
		},

		_renderPreviews: function (files, nodes) {
			var that = this,
				options = this.options;
			nodes.find('.preview span').each(function (index, element) {
				var file = files[index];
				if (options.previewSourceFileTypes.test(file.type) &&
					($.type(options.previewSourceMaxFileSize) !== 'number' ||
						file.size < options.previewSourceMaxFileSize)) {
					that._processingQueue = that._processingQueue.pipe(function () {
						var dfd = $.Deferred();
						that._renderPreview(file, $(element)).done(
							function () {
								dfd.resolveWith(that);
							}
						);
						return dfd.promise();
					});
				}
			});
			return this._processingQueue;
		},

		_renderUpload: function (files) {
			return this._renderTemplate(
				this.options.uploadTemplate,
				files
			);
		},

		_renderDownload: function (files) {
			return this._renderTemplate(
				this.options.downloadTemplate,
				files
			).find('a[download]').each(this._enableDragToDesktop).end();
		},

		_startHandler: function (e) {
			e.preventDefault();
			var button = $(this),
				template = button.closest('.template-upload'),
				data = template.data('data');
			if (data && data.submit && !data.jqXHR && data.submit()) {
				button.prop('disabled', true);
			}
		},

		_cancelHandler: function (e) {
			e.preventDefault();
			var template = $(this).closest('.template-upload'),
				data = template.data('data') || {};
			if (!data.jqXHR) {
				data.errorThrown = 'abort';
				e.data.fileupload._trigger('fail', e, data);
			} else {
				data.jqXHR.abort();
			}
		},

		_deleteHandler: function (e) {
			e.preventDefault();
			var button = $(this);
			e.data.fileupload._trigger('destroy', e, {
				context: button.closest('.template-download'),
				url: button.attr('data-url'),
				type: button.attr('data-type') || 'DELETE',
				dataType: e.data.fileupload.options.dataType
			});
		},

		_forceReflow: function (node) {
			return $.support.transition && node.length &&
				node[0].offsetWidth;
		},

		_transition: function (node) {
			var dfd = $.Deferred();
			if ($.support.transition && node.hasClass('fade')) {
				node.bind(
					$.support.transition.end,
					function (e) {
						// Make sure we don't respond to other transitions events
						// in the container element, e.g. from button elements:
						if (e.target === node[0]) {
							node.unbind($.support.transition.end);
							dfd.resolveWith(node);
						}
					}
				).toggleClass('in');
			} else {
				node.toggleClass('in');
				dfd.resolveWith(node);
			}
			return dfd;
		},

		_initButtonBarEventHandlers: function () {
			var fileUploadButtonBar = this.element.find('.fileupload-buttonbar'),
				filesList = this.options.filesContainer,
				ns = this.options.namespace;
			fileUploadButtonBar.find('.start')
				.bind('click.' + ns, function (e) {
					e.preventDefault();
					filesList.find('.start button').click();
				});
			fileUploadButtonBar.find('.cancel')
				.bind('click.' + ns, function (e) {
					e.preventDefault();
					filesList.find('.cancel button').click();
				});
			fileUploadButtonBar.find('.delete')
				.bind('click.' + ns, function (e) {
					e.preventDefault();
					filesList.find('.delete input:checked')
						.siblings('button').click();
					fileUploadButtonBar.find('.toggle')
						.prop('checked', false);
				});
			fileUploadButtonBar.find('.toggle')
				.bind('change.' + ns, function (e) {
					filesList.find('.delete input').prop(
						'checked',
						$(this).is(':checked')
					);
				});
		},

		_destroyButtonBarEventHandlers: function () {
			this.element.find('.fileupload-buttonbar button')
				.unbind('click.' + this.options.namespace);
			this.element.find('.fileupload-buttonbar .toggle')
				.unbind('change.' + this.options.namespace);
		},

		_initEventHandlers: function () {
			parentWidget.prototype._initEventHandlers.call(this);
			var eventData = {fileupload: this};
			this.options.filesContainer
				.delegate(
					'.start button',
					'click.' + this.options.namespace,
					eventData,
					this._startHandler
				)
				.delegate(
					'.cancel button',
					'click.' + this.options.namespace,
					eventData,
					this._cancelHandler
				)
				.delegate(
					'.delete button',
					'click.' + this.options.namespace,
					eventData,
					this._deleteHandler
				);
			this._initButtonBarEventHandlers();
		},

		_destroyEventHandlers: function () {
			var options = this.options;
			this._destroyButtonBarEventHandlers();
			options.filesContainer
				.undelegate('.start button', 'click.' + options.namespace)
				.undelegate('.cancel button', 'click.' + options.namespace)
				.undelegate('.delete button', 'click.' + options.namespace);
			parentWidget.prototype._destroyEventHandlers.call(this);
		},

		_enableFileInputButton: function () {
			this.element.find('.fileinput-button input')
				.prop('disabled', false)
				.parent().removeClass('disabled');
		},

		_disableFileInputButton: function () {
			this.element.find('.fileinput-button input')
				.prop('disabled', true)
				.parent().addClass('disabled');
		},

		_initTemplates: function () {
			var options = this.options;
			options.templatesContainer = document.createElement(
				options.filesContainer.prop('nodeName')
			);
			if (tmpl) {
				if (options.uploadTemplateId) {
					options.uploadTemplate = tmpl(options.uploadTemplateId);
				}
				if (options.downloadTemplateId) {
					options.downloadTemplate = tmpl(options.downloadTemplateId);
				}
			}
		},

		_initFilesContainer: function () {
			var options = this.options;
			if (options.filesContainer === undefined) {
				options.filesContainer = this.element.find('.files');
			} else if (!(options.filesContainer instanceof $)) {
				options.filesContainer = $(options.filesContainer);
			}
		},

		_stringToRegExp: function (str) {
			var parts = str.split('/'),
				modifiers = parts.pop();
			parts.shift();
			return new RegExp(parts.join('/'), modifiers);
		},

		_initRegExpOptions: function () {
			var options = this.options;
			if ($.type(options.acceptFileTypes) === 'string') {
				options.acceptFileTypes = this._stringToRegExp(
					options.acceptFileTypes
				);
			}
			if ($.type(options.previewSourceFileTypes) === 'string') {
				options.previewSourceFileTypes = this._stringToRegExp(
					options.previewSourceFileTypes
				);
			}
		},

		_initSpecialOptions: function () {
			parentWidget.prototype._initSpecialOptions.call(this);
			this._initFilesContainer();
			this._initTemplates();
			this._initRegExpOptions();
		},

		_create: function () {
			parentWidget.prototype._create.call(this);
			this._refreshOptionsList.push(
				'filesContainer',
				'uploadTemplateId',
				'downloadTemplateId'
			);
			if (!$.blueimpFP) {
				this._processingQueue = $.Deferred().resolveWith(this).promise();
				this.process = function () {
					return this._processingQueue;
				};
			}
		},

		enable: function () {
			parentWidget.prototype.enable.call(this);
			this.element.find('input, button').prop('disabled', false);
			this._enableFileInputButton();
		},

		disable: function () {
			this.element.find('input, button').prop('disabled', true);
			this._disableFileInputButton();
			parentWidget.prototype.disable.call(this);
		}

	});

}));

/*
 * jQuery File Upload Plugin Localization Example 6.5.1
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2012, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*global window */

window.locale = {
	"fileupload": {
		"errors": {
			"maxFileSize": "File is too big",
			"minFileSize": "File is too small",
			"acceptFileTypes": "Filetype not allowed",
			"maxNumberOfFiles": "Max number of files exceeded",
			"uploadedBytes": "Uploaded bytes exceed file size",
			"emptyResult": "Empty file upload result"
		},
		"error": "Error",
		"start": "Start",
		"cancel": "Cancel",
		"destroy": "Delete"
	}
};


