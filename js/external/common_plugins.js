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

/* Jquery caret */

﻿(function($,len,createRange,duplicate){
	$.fn.caret=function(options,opt2){
		var start,end,t=this[0],browser=$.browser.msie;
		if(typeof options==="object" && typeof options.start==="number" && typeof options.end==="number") {
			start=options.start;
			end=options.end;
		} else if(typeof options==="number" && typeof opt2==="number"){
			start=options;
			end=opt2;
		} else if(typeof options==="string"){
			if((start=t.value.indexOf(options))>-1) end=start+options[len];
			else start=null;
		} else if(Object.prototype.toString.call(options)==="[object RegExp]"){
			var re=options.exec(t.value);
			if(re != null) {
				start=re.index;
				end=start+re[0][len];
			}
		}
		if(typeof start!="undefined"){
			if(browser){
				var selRange = this[0].createTextRange();
				selRange.collapse(true);
				selRange.moveStart('character', start);
				selRange.moveEnd('character', end-start);
				selRange.select();
			} else {
				this[0].selectionStart=start;
				this[0].selectionEnd=end;
			}
			this[0].focus();
			return this
		} else {
		   if(browser){
				var selection=document.selection;
				if (this[0].tagName.toLowerCase() != "textarea") {
					var val = this.val(),
					range = selection[createRange]()[duplicate]();
					range.moveEnd("character", val[len]);
					var s = (range.text == "" ? val[len]:val.lastIndexOf(range.text));
					range = selection[createRange]()[duplicate]();
					range.moveStart("character", -val[len]);
					var e = range.text[len];
				} else {
					var range = selection[createRange](),
					stored_range = range[duplicate]();
					stored_range.moveToElementText(this[0]);
					stored_range.setEndPoint('EndToEnd', range);
					var s = stored_range.text[len] - range.text[len],
					e = s + range.text[len]
				}
			} else {
				var s=t.selectionStart,
					e=t.selectionEnd;
			}
			var te=t.value.substring(s,e);
			return {start:s,end:e,text:te,replace:function(st){
				return t.value.substring(0,s)+st+t.value.substring(e,t.value[len])
			}}
		}
	}
})(jQuery,"length","createRange","duplicate");
