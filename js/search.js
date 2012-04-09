OBJECT.search = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.parse_area();
	this.val = this.get_val();
}

extend(OBJECT.search, OBJECT.base, {
	class_name: 'search',
	area: [],
	child_config: {
		area: '.search_boxes input',
		field: '.field .search',
		button: '.field .search-button',
		tip: '.field .search-tip'
	},
	parse_area: function() {
		var area = [];
		this.child.area.each(function(){
			if ($(this).is(':checked')) {
				area.push($(this).val());
			}
		});
		this.area = area;
	},
	get_val: function() {
		return this.child.field.val().replace(/\//g," ");
	},
	events: {
		area: {
			click: function() {
				this.parse_area();
			}
		},
		field: {
			keyup: function() {
				var val = this.get_val();
				if (this.val != val && val.length > 0) {
					this.val = val;
					var area = this.area.join(',');
					Ajax.get('/ajax/search_tip', {area: area, val: val}, function(response) {
						console.log(response);
					});
				}
			}
		},
		button: {},
		tip: {}
	}
});

/*

	$("input.search").keyup(function(e){
		string = urlencode($(this).val().replace(/\//g," "));
		if (e.which != 38 && e.which != 40) {
			if ($("#search-tip").is(".search-main")) var index = '&index=1';
			else var index = '&index=0';
			$("#search-tip").load(window.config.site_dir+'/ajax.php?m=search&f=searchtip&data='+string+'&area='+$("input.search").attr('rel')+index);
		}
	});

	window.area = '';
	$(".searcharea:checked").each(function(){
		window.area = window.area + $(this).val();
	});
	$("input.search").attr('rel',window.area);

	$("input.search").keydown(function(e){
		switch (e.which) {
			case 40:
				b = parseInt($("#search-tip").attr('rel')); a = b + 1;
				if (!(a > $('.search-tip').size())) {
					$('.search-tip-'+b).parent().removeClass('active');
					$('.search-tip-'+a).parent().addClass('active');
					if ($('.search-tip-'+a).is(".tip-type-search")) {
						$(this).val($('.search-tip-'+a).attr('rel'));
					}
					else {
						$(this).val($('.search-tip-'+a).html().split(': ')[1]);
					}
					$("#search-tip").attr('rel',a);
				}
				break;
			case 38:
				b = parseInt($("#search-tip").attr('rel')); a = b - 1;
				if (!(a < 0)) {
					$('.search-tip-'+b).parent().removeClass('active');
					$('.search-tip-'+a).parent().addClass('active');
					$(this).val($('.search-tip-'+a).attr('rel'));
					$("#search-tip").attr('rel',a);
				}
				break;
			case 13:
				if ($(this).val().length > 2 && $(this).attr('rel').length > 0) {
					if ($(this).attr('rel') == 'a') sort_type = 'art';
					else sort_type = 'rel';
					document.location.href='/search/'+$(this).attr('rel')+'/'+sort_type+'/'+urlencode($(this).val().replace(/\//g," "))+'/';
				}
				break;
			default:
				break;
		}
	});

	$(".search-tip").live('click',function(event){
		if (event.button == 0) {
			if($(this).is(".tip-type-search")) {
				event.preventDefault();
				$("input.search").val($(this).attr('rel'));
				$("input.searchb").click();
			}
			else {
				document.location.href = $(this).attr('rel');
			}
		}
	});

	$("input.searchb").click(function(event){
		event.preventDefault();
		search_string = trim($("input.search").val().replace(/\//g," "));
		if (search_string.length > 2) {
			if ($("input.search").attr('rel') == 'a') sort_type = 'art';
			else sort_type = 'rel';
			if ($("input.search").attr('rel').length > 0)
				document.location.href='/search/'+$("input.search").attr('rel')+'/'+sort_type+'/'+urlencode(search_string)+'/';
			else
				alert('Задайте область поиска.');
		}
		else {
			alert('В строке поиска должно быть больше двух символов.');
		}
	});

	$("input.search_logs").keydown(function(e){
		switch (e.which) {
			case 13:
				if ($(this).val().length > 2) {
					document.location.href='/logs/search/'+urlencode($(this).val().replace(/\//g," "))+'/';
				}
				break;
			default:
				break;
		}
	});

	$("input.search_logs_button").click(function(event){
		event.preventDefault();
		search_string = trim($("input.search_logs").val().replace(/\//g," "));
		if (search_string.length > 2) {
			document.location.href='/logs/search/'+urlencode(search_string)+'/';
		} else {
			alert('В строке поиска должно быть больше двух символов.');
		}
	});

	$(".searcharea").change(function(){
		window.area = '';
		$(".searcharea:checked").each(function(){
			window.area = window.area + $(this).val();
		});
		$("input.search").attr('rel',window.area);
	});

	$(".search-options").click(function(){
		if ($(this).attr('rel') != 'open') {
			$(this).parent('td').children('div').slideDown();
			$(this).attr('rel','open');
			$(this).html('Спрятать опции поиска');
		}
		else {
			$(this).parent('td').children('div').slideUp();
			$(this).attr('rel','closed');
			$(this).html('Показать опции поиска');
		}
	});

	$(".secondary_searcharea").change(function(){
		window.area = '';
		$(".secondary_searcharea:checked").each(function(){
			window.area = window.area + $(this).val();
		});
		path = $(".secondary_search").attr("href").split('/');
		$(".secondary_search").attr("href",'/search/'+window.area+'/'+path[3]+'/'+path[4]+'/');
	});

	$(".show_searchareas").click(function(){
		if ($(this).attr('rel') != 'open') {
			$('.secondary_searchareas').slideDown();
			$(this).attr('rel','open');
			$(this).html('Спрятать область поиска.');
		}
		else {
			$('.secondary_searchareas').slideUp();
			$(this).attr('rel','closed');
			$(this).html('Изменить область поиска.');
		}
	});

	$(".search-switcher").change(function(){
		path = window.location.pathname.split('/');
		document.location.href='/search/'+path[2]+'/'+$(this).val()+'/'+path[4]+'/';
	});

	*/
