/* Jquery cookie */

jQuery.cookie = function (key, value, options) {
	if (arguments.length > 1 && (value === null || typeof value !== "object")) {
		options = jQuery.extend({}, options);
		if (value === null) { options.expires = -1; }

		if (typeof options.expires === 'number') {
			var days = options.expires, t = options.expires = new Date();
			t.setDate(t.getDate() + days);
		}

		return (document.cookie = [
			encodeURIComponent(key), '=',
			options.raw ? String(value) : encodeURIComponent(String(value)),
			options.expires ? '; expires=' + options.expires.toUTCString() : '',
			options.path ? '; path=' + options.path : '',
			options.domain ? '; domain=' + options.domain : '',
			options.secure ? '; secure' : ''
		].join(''));
	}

	options = value || {};
	var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
	return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

/* Jquery tooltip */

(function($) {
	$.fn.easyTooltip = function(options){
		var defaults = {
			xOffset: 10,
			yOffset: 25,
			tooltipId: "easyTooltip",
			clickRemove: true,
			content: "",
			useElement: "",
			timeOut: false
		};
		var options = $.extend(defaults, options);
		var content;
		this.each(function() {
			var title = $(this).attr("title");
			$(this).hover(function(e){
				$("#" + options.tooltipId).remove();
				$(this).attr("title","");
				content = (options.content != "") ? options.content : title;
				content = (options.useElement != "") ? $("#" + options.useElement).html() : content;
				if (content != "" && content != undefined){
					$("body").append("<div id='"+ options.tooltipId +"'>"+ content +"</div>");
					if (options.timeOut) {
						$("#" + options.tooltipId)
							.css("position","absolute")
							.css("top",(e.pageY - options.yOffset) + "px")
							.css("left",(e.pageX + options.xOffset) + "px")
							.css("display","none");
							setTimeout(function() {$("#" + options.tooltipId).fadeIn("fast")}, options.timeOut);
					} else {
						$("#" + options.tooltipId)
							.css("position","absolute")
							.css("top",(e.pageY - options.yOffset) + "px")
							.css("left",(e.pageX + options.xOffset) + "px")
							.css("display","none").fadeIn("fast");
					}
				}
			},
			function(){
				$("#" + options.tooltipId).remove();
				$(this).attr("title",title);
			});
			$(this).mousemove(function(e){
				$("#" + options.tooltipId)
					.css("top",(e.pageY - options.yOffset) + "px")
					.css("left",(e.pageX + options.xOffset) + "px")
			});
			if(options.clickRemove){
				$(this).mousedown(function(e){
					$("#" + options.tooltipId).remove();
					$(this).attr("title",title);
				});
			}
		});
	};
})(jQuery);
